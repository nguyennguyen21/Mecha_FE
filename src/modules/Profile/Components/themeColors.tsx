// Legacy themeColors - now uses theme system
// This file is kept for backward compatibility
// Use useTheme hook instead for new code

import { getTheme } from '../../../styles/themes';

export const getThemeColors = (themeId: string = 'dark-blur') => {
  const theme = getTheme(themeId as any);
  return {
    background: theme.colors.background,
    cardBackground: theme.colors.cardBackground,
    textPrimary: theme.colors.textPrimary,
    textSecondary: theme.colors.textSecondary,
    border: theme.colors.border,
    accent: theme.colors.accent,
  };
};

// Default export for backward compatibility
export const themeColors = getThemeColors('dark-blur');
