# 🎨 Mecha Bio-Link Themes

## Overview

Mecha now includes 5 premium bio-link themes, each with unique styling and animations.

## Available Themes

### 1. ⭐ Dark Blur Modern
**Style**: Dark purple/black, frosted glass, soft glows, floating shadows, futuristic
- Heavy blur effects
- Layered cards
- Floating elements
- Particle animations

**Best for**: Modern, futuristic profiles

### 2. 🌟 Light Minimal Apple-Style
**Style**: White, light gray, subtle depth, no glow, elegant shadows
- Clean, Apple-inspired design
- High whitespace
- Premium minimalism
- Smooth edges

**Best for**: Professional, clean profiles

### 3. 💫 Vaporwave / Retro Aesthetic
**Style**: Neon pink/teal, glitch textures, grid backgrounds, retro-future
- 90s cyber aesthetics
- Glitch effects
- Grid backgrounds
- Neon glows

**Best for**: Retro, cyberpunk profiles

### 4. 📊 Card Grid Layout
**Style**: Modern dashboard aesthetic, clean, semi-professional
- Modular cards
- Grid layout
- Dashboard feel
- Clean design

**Best for**: Professional, organized profiles

### 5. 🎀 Cute Emoji Bubble Theme
**Style**: Round bubbles, emojis, soft gradients, playful animations
- Pastel colors
- Bubble design
- Emoji decorations
- Playful animations

**Best for**: Fun, casual profiles

## Usage

### In Components

```tsx
import { useThemeContext } from '../components/ThemeProvider';

function MyComponent() {
  const { currentTheme, changeTheme } = useThemeContext();
  
  return (
    <div style={{ background: currentTheme.colors.background }}>
      <button onClick={() => changeTheme('dark-blur')}>
        Switch Theme
      </button>
    </div>
  );
}
```

### Using Hook Directly

```tsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { currentTheme, changeTheme } = useTheme();
  // ...
}
```

### Theme Selector Component

```tsx
import { ThemeSelector } from './modules/Profile/Components/ThemeSelector';

<ThemeSelector 
  currentTheme={currentThemeId}
  onThemeChange={changeTheme}
/>
```

## Theme Structure

Each theme includes:
- **Colors**: background, cardBackground, textPrimary, textSecondary, border, accent
- **Styles**: borderRadius, blur, shadow, glow
- **Animations**: particles, floating, glitch, wiggle

## CSS Classes

Themes are applied via CSS classes on the body element:
- `.theme-dark-blur`
- `.theme-light-minimal`
- `.theme-vaporwave`
- `.theme-card-grid`
- `.theme-cute-bubble`

## Customization

Themes are defined in `src/styles/themes.ts` and styled in `src/styles/themeStyles.css`.

To add a new theme:
1. Add theme config to `themes.ts`
2. Add CSS styles to `themeStyles.css`
3. Update the `ThemeId` type

## Storage

Selected theme is automatically saved to `localStorage` with key `mecha_selected_theme`.



