export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  styles: {
    containerFlexDirection?: string;
    containerJustifyContent?: string;
    containerAlignItems?: string;
    containerFlexWrap?: string;
    containerGap?: string;
    containerTextAlign?: string;
    avatarOrder: number;
    usernameOrder: number;
    descriptionOrder: number;
    locationOrder: number;
    iconOrder: number;
    audioOrder: number;
    // Clear free positioning when applying preset
    containerPositionX?: undefined;
    containerPositionY?: undefined;
    avatarPositionX?: undefined;
    avatarPositionY?: undefined;
    usernamePositionX?: undefined;
    usernamePositionY?: undefined;
    descriptionPositionX?: undefined;
    descriptionPositionY?: undefined;
    locationPositionX?: undefined;
    locationPositionY?: undefined;
    socialPositionX?: undefined;
    socialPositionY?: undefined;
    audioPositionX?: undefined;
    audioPositionY?: undefined;
  };
}

// Link-in-Bio Style Layouts
export const layoutPresets: LayoutPreset[] = [
  {
    id: 'link-in-bio',
    name: 'Link in Bio',
    description: 'Modern link-in-bio style with glassmorphism effect - perfect for showcasing your profile, links, and music',
    icon: 'fa-link',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'center',
      containerAlignItems: 'center',
      containerFlexWrap: 'nowrap',
      containerGap: '20px',
      containerTextAlign: 'center',
      avatarOrder: 1,
      usernameOrder: 2,
      descriptionOrder: 3,
      locationOrder: 4,
      iconOrder: 5,
      audioOrder: 6,
      // Clear free positioning
      containerPositionX: undefined,
      containerPositionY: undefined,
      avatarPositionX: undefined,
      avatarPositionY: undefined,
      usernamePositionX: undefined,
      usernamePositionY: undefined,
      descriptionPositionX: undefined,
      descriptionPositionY: undefined,
      locationPositionX: undefined,
      locationPositionY: undefined,
      socialPositionX: undefined,
      socialPositionY: undefined,
      audioPositionX: undefined,
      audioPositionY: undefined,
    }
  },
  {
    id: 'left-aligned-profile',
    name: 'Left Aligned Profile',
    description: 'Left-aligned profile layout with avatar on the left, info on the right, and social links with music player below',
    icon: 'fa-align-left',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'flex-start',
      containerAlignItems: 'flex-start',
      containerFlexWrap: 'nowrap',
      containerGap: '16px',
      containerTextAlign: 'left',
      avatarOrder: 1,
      usernameOrder: 2,
      descriptionOrder: 3,
      locationOrder: 4,
      iconOrder: 5,
      audioOrder: 6,
      // Clear free positioning
      containerPositionX: undefined,
      containerPositionY: undefined,
      avatarPositionX: undefined,
      avatarPositionY: undefined,
      usernamePositionX: undefined,
      usernamePositionY: undefined,
      descriptionPositionX: undefined,
      descriptionPositionY: undefined,
      locationPositionX: undefined,
      locationPositionY: undefined,
      socialPositionX: undefined,
      socialPositionY: undefined,
      audioPositionX: undefined,
      audioPositionY: undefined,
    }
  }
];
