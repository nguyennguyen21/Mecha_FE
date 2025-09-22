import { useState, useEffect } from 'react';
import { type UserStyleRaw, type UserStyle, type ProfileData } from '../types/profile';
import { apiService } from '../services/api';
import { parseStyles } from '../utils/styleUtils';

export const useUserStyle = (userId: number | undefined, usernameFallback = "Guest") => {
  const [style, setStyle] = useState<UserStyleRaw | null>(null);
  const [parsedStyles, setParsedStyles] = useState<UserStyle>({
    username: usernameFallback, // initial default
  });

  useEffect(() => {
    if (!userId) {
      console.warn("❌ No userId provided for fetching style");
      return;
    }

    const fetchStyle = async () => {
      try {
        const data = await apiService.fetchUserStyle(userId);
        setStyle(data);

        const parsedData = parseStyles(data);
        
        const parsed: UserStyle = {
          username: data?.username ?? usernameFallback,
          idUser: userId, // Explicitly set the userId here
          ...parsedData,
        };

        setParsedStyles(parsed);
      } catch (err) {
        console.error("❌ Failed to fetch user style:", err);
      }
    };

    fetchStyle();
  }, [userId, usernameFallback]);

  return { style, parsedStyles };
};