// hooks/useProfileData.ts
import { useState, useEffect } from 'react';
import { type ProfileData } from '../../../types';
import { apiService } from '../services/api';

export const useProfileData = (username: string | undefined) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.fetchProfile(username);
        setProfile(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, loading, error };
};