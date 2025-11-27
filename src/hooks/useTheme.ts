import { useState, useEffect, useCallback } from 'react';
import { themes, getTheme, type ThemeId, type ThemeConfig } from '../styles/themes';

const THEME_STORAGE_KEY = 'mecha_selected_theme';

export const useTheme = () => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    // Load from localStorage or default to dark-blur
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return (saved as ThemeId) || 'dark-blur';
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    return getTheme(currentThemeId);
  });

  // Update theme when ID changes
  useEffect(() => {
    const theme = getTheme(currentThemeId);
    setCurrentTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, currentThemeId);
    
    // Apply theme class to body
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
    document.body.classList.add(`theme-${currentThemeId}`);
  }, [currentThemeId]);

  const changeTheme = useCallback((themeId: ThemeId) => {
    setCurrentThemeId(themeId);
  }, []);

  return {
    currentTheme,
    currentThemeId,
    changeTheme,
    themes: Object.values(themes),
  };
};

