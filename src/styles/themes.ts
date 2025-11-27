// Theme System - 5 Premium Bio-Link Themes

export type ThemeId = 'dark-blur' | 'light-minimal' | 'vaporwave' | 'card-grid' | 'cute-bubble';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    accent: string;
    accentSecondary?: string;
  };
  styles: {
    borderRadius: string;
    blur: string;
    shadow: string;
    glow?: string;
  };
  animations?: {
    particles?: boolean;
    floating?: boolean;
    glitch?: boolean;
    wiggle?: boolean;
  };
}

// ⭐ Theme 1: Dark Blur Modern (guns.lol style)
export const darkBlurTheme: ThemeConfig = {
  id: 'dark-blur',
  name: 'Dark Blur Modern',
  description: 'Heavy blur effects, layered cards, floating elements - futuristic dark purple/black',
  colors: {
    background: '#1a0a2e',
    cardBackground: 'rgba(30, 20, 50, 0.4)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(139, 92, 246, 0.3)',
    accent: '#8b5cf6',
    accentSecondary: '#a78bfa',
  },
  styles: {
    borderRadius: '24px',
    blur: 'blur(20px)',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.2)',
    glow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
  },
  animations: {
    particles: true,
    floating: true,
  },
};

// ⭐ Theme 2: Light Minimal Apple-Style
export const lightMinimalTheme: ThemeConfig = {
  id: 'light-minimal',
  name: 'Light Minimal',
  description: 'Clean, Apple-inspired design - white, light gray, subtle depth, elegant shadows',
  colors: {
    background: '#fafafa',
    cardBackground: '#ffffff',
    textPrimary: '#1d1d1f',
    textSecondary: '#86868b',
    border: '#e5e5e7',
    accent: '#0071e3',
  },
  styles: {
    borderRadius: '18px',
    blur: 'none',
    shadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
  },
  animations: {
    floating: false,
  },
};

// ⭐ Theme 3: Vaporwave / Retro Aesthetic
export const vaporwaveTheme: ThemeConfig = {
  id: 'vaporwave',
  name: 'Vaporwave Retro',
  description: 'Neon pink/teal, glitch textures, grid backgrounds, retro-future 90s cyber',
  colors: {
    background: '#8338ec',
    cardBackground: 'rgba(255, 0, 110, 0.2)',
    textPrimary: '#ff006e',
    textSecondary: '#ffbe0b',
    border: '#8338ec',
    accent: '#ff006e',
    accentSecondary: '#3a86ff',
  },
  styles: {
    borderRadius: '8px',
    blur: 'blur(1px)',
    shadow: '0 0 20px rgba(255, 0, 110, 0.6), inset 0 0 20px rgba(131, 56, 236, 0.3)',
    glow: '0 0 30px rgba(255, 0, 110, 0.8), 0 0 60px rgba(58, 134, 255, 0.4)',
  },
  animations: {
    glitch: true,
    particles: true,
  },
};

// ⭐ Theme 4: Card Grid Layout
export const cardGridTheme: ThemeConfig = {
  id: 'card-grid',
  name: 'Card Grid',
  description: 'Modern dashboard aesthetic - modular cards, clean, semi-professional',
  colors: {
    background: '#f3f4f6',
    cardBackground: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    accent: '#6366f1',
  },
  styles: {
    borderRadius: '12px',
    blur: 'none',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  },
  animations: {
    floating: false,
  },
};

// ⭐ Theme 5: Cute Emoji Bubble Theme
export const cuteBubbleTheme: ThemeConfig = {
  id: 'cute-bubble',
  name: 'Cute Bubble',
  description: 'Round bubbles, emojis, soft gradients, playful animations - pastel colors',
  colors: {
    background: '#fecfef',
    cardBackground: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#ff6b9d',
    textSecondary: '#ffa8c5',
    border: 'rgba(255, 182, 193, 0.5)',
    accent: '#ff6b9d',
    accentSecondary: '#ffa8c5',
  },
  styles: {
    borderRadius: '50px',
    blur: 'blur(10px)',
    shadow: '0 8px 32px rgba(255, 107, 157, 0.3), 0 0 0 1px rgba(255, 182, 193, 0.2)',
    glow: '0 0 20px rgba(255, 107, 157, 0.4)',
  },
  animations: {
    wiggle: true,
    floating: true,
    particles: true,
  },
};

// Export all themes
export const themes: Record<ThemeId, ThemeConfig> = {
  'dark-blur': darkBlurTheme,
  'light-minimal': lightMinimalTheme,
  'vaporwave': vaporwaveTheme,
  'card-grid': cardGridTheme,
  'cute-bubble': cuteBubbleTheme,
};

// Get theme by ID
export const getTheme = (id: ThemeId): ThemeConfig => {
  return themes[id] || darkBlurTheme;
};

// Get default theme
export const getDefaultTheme = (): ThemeConfig => darkBlurTheme;

