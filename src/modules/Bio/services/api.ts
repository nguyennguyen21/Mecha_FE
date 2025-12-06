// services/api.ts
import { type ProfileData, type UserStyleRaw } from '../types/profile';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';
const REQUEST_TIMEOUT = 20000; // 20 seconds
const MAX_RETRIES = 5; // Increased retries
const RETRY_DELAY = 2000; // 2 seconds initial delay

// XMLHttpRequest fallback for QUIC errors
const fetchWithXHR = (url: string, options: RequestInit = {}, timeout: number = REQUEST_TIMEOUT): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const timeoutId = setTimeout(() => {
      xhr.abort();
      reject(new Error('Request timeout - please try again'));
    }, timeout);

    xhr.onload = () => {
      clearTimeout(timeoutId);
      
      // Create a proper Response object
      const contentType = xhr.getResponseHeader('Content-Type') || 'application/json';
      const blob = new Blob([xhr.responseText], { type: contentType });
      
      const response = new Response(blob, {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: new Headers({
          'Content-Type': contentType,
        }),
      });
      
      // Add json method if not present
      if (!response.json) {
        (response as any).json = async () => {
          try {
            return JSON.parse(xhr.responseText);
          } catch {
            throw new Error('Invalid JSON response');
          }
        };
      }
      
      resolve(response);
    };

    xhr.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('Network error - please check your connection and try again'));
    };

    xhr.ontimeout = () => {
      clearTimeout(timeoutId);
      reject(new Error('Request timeout - please try again'));
    };

    xhr.open(options.method || 'GET', url, true);
    xhr.timeout = timeout;

    // Set headers
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          xhr.setRequestHeader(key, value);
        }
      });
    }

    xhr.send(options.body as any);
  });
};

// Helper function to add cache buster to URL to force new connection
const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

// Helper function to create fetch with timeout and XHR fallback
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = REQUEST_TIMEOUT, useXHR: boolean = false, retryCount: number = 0): Promise<Response> => {
  // Add cache buster on retries to force new connection
  const finalUrl = retryCount > 0 ? addCacheBuster(url) : url;
  
  // Use XHR directly if requested (for QUIC fallback)
  if (useXHR) {
    return fetchWithXHR(finalUrl, options, timeout);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(finalUrl, {
      ...options,
      signal: controller.signal,
      cache: 'no-store', // Changed from 'no-cache' to 'no-store'
      credentials: 'omit', // Don't send credentials to avoid connection issues
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // If QUIC error, try with XHR fallback after a delay
    if (error.message?.includes('QUIC') || error.message?.includes('ERR_QUIC')) {
      // Wait a bit before trying XHR to let QUIC connection reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        return await fetchWithXHR(finalUrl, options, timeout);
      } catch (xhrError: any) {
        // If XHR also fails with QUIC, throw with more context
        if (xhrError.message?.includes('QUIC') || xhrError.message?.includes('ERR_QUIC')) {
          throw new Error('QUIC protocol error - server may be experiencing issues. Please try again later.');
        }
        throw new Error('Network error - please check your connection and try again');
      }
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    
    // Handle other network errors
    if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
      // Wait before trying XHR
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        return await fetchWithXHR(finalUrl, options, timeout);
      } catch (xhrError: any) {
        throw new Error('Network error - please check your connection and try again');
      }
    }
    
    throw error;
  }
};

// Retry helper function with QUIC error handling
const retryFetch = async <T>(
  fetchFn: (useXHR?: boolean, retryCount?: number) => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY,
  useXHR: boolean = false,
  retryCount: number = 0
): Promise<T> => {
  try {
    return await fetchFn(useXHR, retryCount);
  } catch (error: any) {
    const isRetryableError = 
      error.message?.includes('timeout') ||
      error.message?.includes('Network error') ||
      error.message?.includes('QUIC') ||
      error.message?.includes('ERR_QUIC') ||
      error.message?.includes('Failed to fetch');
    
    if (retries > 0 && isRetryableError) {
      // If QUIC error and haven't tried XHR yet, use XHR on next retry
      const shouldUseXHR = (error.message?.includes('QUIC') || error.message?.includes('ERR_QUIC')) && !useXHR;
      
      // Longer delay for QUIC errors to let connection reset
      const retryDelay = error.message?.includes('QUIC') || error.message?.includes('ERR_QUIC') 
        ? Math.max(delay * 2, 3000) // At least 3 seconds for QUIC errors
        : delay;
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return retryFetch(fetchFn, retries - 1, delay * 1.5, shouldUseXHR, retryCount + 1); // Exponential backoff
    }
    throw error;
  }
};

export const apiService = {
  async fetchProfile(username: string): Promise<ProfileData> {
    return retryFetch(async (useXHR = false, retryCount = 0) => {
      const res = await fetchWithTimeout(
        `${BASE_URL}/api/profile/username/${username}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        },
        REQUEST_TIMEOUT,
        useXHR,
        retryCount
      );
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Fetch failed: ${res.status} - ${errorText}`);
      }
      
      return res.json();
    });
  },

  async fetchUserStyle(userId: number): Promise<UserStyleRaw> {
    return retryFetch(async (useXHR = false, retryCount = 0) => {
      const url = `${BASE_URL}/api/UserStyles/${userId}`;
      
      const res = await fetchWithTimeout(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        },
        REQUEST_TIMEOUT,
        useXHR,
        retryCount
      );
      
      if (!res.ok) {
        await res.text().catch(() => {}); // Consume response body
        throw new Error(`Failed to fetch style: ${res.status}`);
      }

      return res.json();
    });
  },

  getAssetUrl(path: string): string {
    return `${BASE_URL}${path}`;
  }
};