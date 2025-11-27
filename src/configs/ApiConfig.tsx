// src/config/apiConfig.ts

const getApiUrl = (): string => {
  // Lấy từ env, mặc định là localhost:5159 (backend port)
  return import.meta.env.VITE_BASE_URL || 'http://localhost:5159';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(), // → http://localhost:5159
};