export interface ProfileFormData {
  profileAvatar: string;
  background: string;
  audio: string;
  audioImage: string;
  audioTitle: string;
  customCursor: string;
  description: string;
  username: string;
  displayName: string;
  effectUsername: string;
  location: string;
}

// File state riêng cho upload
export interface FileState {
  profileAvatar: string;
  background: string;
  audio: string;
  audioImage: string;
}

// Updated CustomStyles interface với đầy đủ properties
export interface CustomStyles {
  // Profile Container
  profileBorder?: string;
  profileBorderWidth: string;
  profileBorderStyle: string;
  profileBorderColor: string;
  profileBorderRadius: string;
  profilePadding: string;
  profileBackgroundColor: string;
  profileOpacity: number;
  profileBoxShadow: string;
  profileGap?: number;
  containerGap?: string;

  // Avatar
  avatarBorder?: string;
  avatarBorderRadius: string;
  avatarShowBorder: boolean;
  avatarBorderWidth: string;
  avatarBorderStyle: string;
  avatarBorderColor: string;
  avatarMargin?: string;

  // Username
  usernameFontSize: string;
  usernameFontStyle: string;
  usernameFontWeight: string;
  usernameColor: string;
  usernameTextShadow: string;
  usernameTextTransform: "none" | "capitalize" | "uppercase" | "lowercase" | "full-width" | "full-size-kana";
  usernameLetterSpacing: string;
  usernameMargin?: string;

  // Description
  description?: string;
  descriptionFontSize?: string;
  descriptionColor?: string;
  descriptionTextAlign?: string;
  descriptionMargin?: string;

  // Location
  locationFontSize: string;
  locationColor: string;
  locationFontStyle: string;
  locationFontWeight?: string;
  locationMargin?: string;

  // Audio Title
  audioTitleFontSize?: string;
  audioTitleFontWeight?: string;
  audioTitleColor?: string;
  audioTitleLetterSpacing?: string;
  audioTitleMargin?: string;
  audioHeight?: string;
  audioWidth?: string;
  audioMargin?: string;

  // Cover Image
  coverImageBorder?: string;
  coverImageWidth: string;
  coverImageHeight: string;
  coverImageBorderRadius: string;
  coverImageBorderWidth: string;
  coverImageBorderStyle: string;
  coverImageBorderColor: string;
  coverImageBoxShadow: string;
  coverImageObjectFit: string;

  // Cursor
  cursorType?: string;
  cursorFontSize?: string;
  cursorFontWeight?: string;
  cursorColor?: string;
  cursorWidth?: string;
  cursorHeight?: string;

  // Order properties
  avatarOrder?: number;
  usernameOrder?: number;
  descriptionOrder?: number;
  locationOrder?: number;
  audioOrder?: number;
}

// DTO khi lấy style riêng
export interface UserStyleDto {
  idUser: number;
  styles: CustomStyles;
}




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
  displayName?: string;
  effectUsername?: string;
  location?: string;
};

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
  profileGap?: number;

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
  usernameMargin?: string; // <-- margin riêng cho username

  descFontSize?: string;
  descFontStyle?: string;
  descFontWeight?: string;
  descColor?: string;
  descTextShadow?: string;
  descTextTransform?: "none" | "capitalize" | "uppercase" | "lowercase" | "initial" | "inherit";
  descLetterSpacing?: string;
  descMargin?: string; // <-- margin riêng cho description

  locationFontSize?: string;
  locationColor?: string;
  locationFontStyle?: string;
  locationFontWeight?: string;
  locationMargin?: string; // <-- margin riêng cho location

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

  containerGap?: string;

  // New fields
  background?: string;
  backgroundMargin?: string; // margin riêng
  audio?: string;
  audioMargin?: string; 
  audioImage?: string;
  audioImageMargin?: string;
  audioTitle?: string;
  audioTitleMargin?: string;
  customCursor?: string;
  customCursorMargin?: string;
  description?: string;
  descriptionMargin?: string;
  username: string;
  effectUsername?: string;
  effectUsernameMargin?: string;
  location?: string;
  locationEffectMargin?: string;

  // Allow any additional properties
  [key: string]: any;
}


export interface AdvancedStyleSettingsProps {
  customStyles: CustomStyles;
  handleStyleChange: (styleKey: string, value: string | number | boolean) => void;
  stylesLoading: boolean;
  userId: number; 
}