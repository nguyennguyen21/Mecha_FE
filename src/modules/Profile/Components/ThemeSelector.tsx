import React from 'react';
import { themes, type ThemeId, type ThemeConfig } from '../../../styles/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="theme-selector p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Choose Your Theme</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(themes).map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={currentTheme === theme.id}
            onSelect={() => onThemeChange(theme.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ThemeCardProps {
  theme: ThemeConfig;
  isSelected: boolean;
  onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, onSelect }) => {
  return (
    <div
      className={`theme-card-preview p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected ? 'border-purple-500 ring-2 ring-purple-300' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
      style={{
        background: typeof theme.colors.background === 'string' && theme.colors.background.includes('gradient')
          ? theme.colors.background
          : theme.colors.background,
      }}
    >
      <div
        className="preview-card p-3 rounded mb-2"
        style={{
          background: theme.colors.cardBackground,
          borderRadius: theme.styles.borderRadius,
          boxShadow: theme.styles.shadow,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-full"
            style={{
              background: theme.colors.accent,
              border: `2px solid ${theme.colors.border}`,
            }}
          />
          <div
            className="text-sm font-semibold"
            style={{ color: theme.colors.textPrimary }}
          >
            Preview
          </div>
        </div>
        <div
          className="text-xs"
          style={{ color: theme.colors.textSecondary }}
        >
          {theme.description}
        </div>
      </div>
      <div className="text-sm font-semibold mt-2" style={{ color: theme.colors.textPrimary }}>
        {theme.name}
      </div>
    </div>
  );
};



