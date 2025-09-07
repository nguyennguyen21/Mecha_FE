export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  preview: string;
  styles: {
    containerFlexDirection: string;
    containerJustifyContent: string;
    containerAlignItems: string;
    containerFlexWrap?: string;
    containerGap: string;
    containerTextAlign: string;
    avatarOrder: number;
    usernameOrder: number;
    locationOrder: number;
    iconOrder: number;
    descriptionOrder: number;
    audioOrder: number;
  };
}

export const layoutPresets: LayoutPreset[] = [
  {
    id: 'centered-column',
    name: 'Centered Column',
    description: 'Classic centered layout with all elements stacked vertically',
    preview: '📱\n🎭\n👤\n📍\n🌐\n📝\n🎵',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'center',
      containerAlignItems: 'center',
      containerFlexWrap: 'nowrap',
      containerGap: '12px',
      containerTextAlign: 'center',
      avatarOrder: 1,
      usernameOrder: 2,
      locationOrder: 4,
      iconOrder: 5,
      descriptionOrder: 3,
      audioOrder: 6
    }
  },
  {
    id: 'right-aligned',
    name: 'Right Aligned',
    description: 'Right-aligned layout for unique presentation',
    preview: '     📱\n     🎭\n     📝\n     📍\n     🌐\n     🎵',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'flex-end',
      containerAlignItems: 'flex-end',
      containerFlexWrap: 'nowrap',
      containerGap: '12px',
      containerTextAlign: 'right',
      avatarOrder: 1,
      usernameOrder: 2,
      descriptionOrder: 3,
      locationOrder: 4,
      iconOrder: 5,
      audioOrder: 6
    }
  },
  {
    id: 'stacked-grid',
    name: 'Stacked Grid',
    description: 'Two-column grid-like layout with vertical stacking',
    preview: '📱 🎭\n👤 📝\n📍 🌐\n🎵',
    styles: {
      containerFlexDirection: 'row',
      containerJustifyContent: 'space-around',
      containerAlignItems: 'flex-start',
      containerFlexWrap: 'wrap',
      containerGap: '15px',
      containerTextAlign: 'left',
      avatarOrder: 1,
      usernameOrder: 3,
      locationOrder: 5,
      iconOrder: 6,
      descriptionOrder: 4,
      audioOrder: 7
    }
  },
  {
    id: 'audio-first',
    name: 'Audio First',
    description: 'Audio player emphasized at the top',
    preview: '🎵\n📱\n👤\n📝\n📍\n🌐',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'flex-start',
      containerAlignItems: 'center',
      containerFlexWrap: 'nowrap',
      containerGap: '12px',
      containerTextAlign: 'center',
      audioOrder: 1,
      avatarOrder: 2,
      usernameOrder: 3,
      descriptionOrder: 4,
      locationOrder: 5,
      iconOrder: 6
    }
  },
  {
    id: 'avatar-username-left-social-right',
    name: 'Avatar & Username Left, Social Right',
    description: 'Avatar and username on the left at the top, social icons on the right, with other elements stacked below',
    preview: '📱 👤 | 🌐\n📝\n📍\n🎵',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'flex-start',
      containerAlignItems: 'flex-start',
      containerFlexWrap: 'nowrap',
      containerGap: '12px',
      containerTextAlign: 'left',
      avatarOrder: 1,
      usernameOrder: 2,
      iconOrder: 3,
      descriptionOrder: 4,
      locationOrder: 5,
      audioOrder: 6
    }
  }
];

