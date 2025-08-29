// types/profile.ts
export type ProfileData = {
  userId: number;
  styleId?: number;
  profileAvatar?: string;
  background?: string;
  audio?: string;
  audioImage?: string;
  audioTitle?: string;
  customCursor?: string;
  description?: string;
  username: string;
  effectUsername?: string;
  location?: string;
};

// Raw UserStyle from backend (what you receive from API)
export interface UserStyleRaw {
  idUser: number;
  stylests: string;
  [key: string]: any;
}

// Parsed styles for UI (all optional) - This is what components should use
export interface UserStyle {
  // Include the raw properties for compatibility
  idUser?: number;
  stylests?: string;
  
  // UI-specific parsed properties
  profileBorderStyle?: string;
  profileBorderWidth?: string;
  profileBorderColor?: string;
  profileBorderRadius?: string;
  profilePadding?: string;
  profileBackgroundColor?: string;
  profileOpacity?: number;
  profileBoxShadow?: string;
  avatarBorderRadius?: string;
  avatarShowBorder?: boolean;
  avatarBorderStyle?: string;
  avatarBorderWidth?: string;
  avatarBorderColor?: string;
  usernameFontSize?: string;
  usernameFontStyle?: string;
  usernameFontWeight?: string;
  usernameColor?: string;
  usernameTextShadow?: string;
  usernameTextTransform?: string;
  usernameLetterSpacing?: string;
  locationFontSize?: string;
  locationColor?: string;
  locationFontStyle?: string;
  cursorWidth?: string;
  cursorHeight?: string;
  cursorType?: string;
  cursorColor?: string;
  cursorFontSize?: string;
  cursorFontWeight?: string;
  audioTitleFontSize?: string;
  audioTitleFontWeight?: string;
  audioTitleColor?: string;
  audioTitleLetterSpacing?: string;
  coverImageWidth?: string;
  coverImageHeight?: string;
  coverImageBorderRadius?: string;
  coverImageObjectFit?: string;
  coverImageBorderStyle?: string;
  coverImageBorderWidth?: string;
  coverImageBorderColor?: string;
  coverImageBoxShadow?: string;
  SubContainerBackgroundColor?: string;
  SubContainerBorder?: string;
  SubContainerBorderradius?: string;
  SubContainerWidth?: string;
  SubContainerMaxWidth?: string; 
  // Allow any additional properties
  [key: string]: any;
}

// Type alias for clarity - components should use this
export type ParsedUserStyle = UserStyle;