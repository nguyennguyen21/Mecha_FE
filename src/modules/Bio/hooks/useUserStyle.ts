// hooks/useUserStyle.ts
import { useState, useEffect } from 'react';
import { type UserStyleRaw, type UserStyle } from '../types/profile';
import { apiService } from '../services/api';
import { parseStyles } from '../utils/styleUtils';

export const useUserStyle = (userId: number | undefined) => {
  const [style, setStyle] = useState<UserStyleRaw | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log("❌ No userId available from profile");
      return;
    }

    console.log("🔍 Fetching style for userId:", userId);

    const fetchStyle = async () => {
      try {
        const data = await apiService.fetchUserStyle(userId);
        setStyle(data);
      } catch (err) {
        console.error("❌ Fetch style error:", err);
      }
    };

    fetchStyle();
  }, [userId]);

  // Log style changes
  useEffect(() => {
    console.log("🎨 Style state changed:", style);
  }, [style]);

  return { style, parsedStyles: parseStyles(style) };
};