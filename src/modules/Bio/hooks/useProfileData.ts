// hooks/useProfileData.ts
import { useState, useEffect } from 'react';
import { type ProfileData } from '../../../types';
import { apiService } from '../services/api';

export const useProfileData = (username: string | undefined) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.fetchProfile(username);
        setProfile(data);
      } catch (err: any) {
        // Provide user-friendly error messages
        let errorMessage = 'Failed to load profile';
        
        if (err.message?.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.message?.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (err.message?.includes('404') || err.message?.includes('not found')) {
          errorMessage = 'Profile not found.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, loading, error };
};