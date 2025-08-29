export interface ProfileFormData {
  profileAvatar: string;
  background: string;
  audio: string;
  audioImage: string;
  audioTitle: string;
  customCursor: string;
  description: string;
  username: string;
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

// Style được lưu trong DB
export interface CustomStyles {
  profileBorder?: string;
  avatarBorder?: string;
  coverImageBorder?: string;

  profileBorderWidth: string;
  profileBorderStyle: string;
  profileBorderColor: string;
  profileBorderRadius: string;
  profilePadding: string;
  profileBackgroundColor: string;
  profileOpacity: number;
  profileBoxShadow: string;

  avatarBorderRadius: string;
  avatarShowBorder: boolean;
  avatarBorderWidth: string;
  avatarBorderStyle: string;
  avatarBorderColor: string;

  usernameFontSize: string;
  usernameFontStyle: string;
  usernameFontWeight: string;
  usernameColor: string;
  usernameTextShadow: string;
  usernameTextTransform: "none" | "capitalize" | "uppercase" | "lowercase" | "full-width" | "full-size-kana"; // ✅ fix type
  usernameLetterSpacing: string;

  locationFontSize: string;
  locationColor: string;
  locationFontStyle: string;

  coverImageWidth: string;
  coverImageHeight: string;
  coverImageBorderRadius: string;
  coverImageBorderWidth: string;
  coverImageBorderStyle: string;
  coverImageBorderColor: string;
  coverImageBoxShadow: string;
  coverImageObjectFit: string;

  audioTitleFontSize?: string;
  audioTitleFontWeight?: string;
  audioTitleColor?: string;
  audioTitleLetterSpacing?: string;
  audioHeight?: string;
  audioWidth?: string;
  cursorType?: string;
  cursorFontSize?: string;
  cursorFontWeight?: string;
  cursorColor?: string;

  cursorWidth?: string;
  cursorHeight?: string;
}

// DTO khi lấy style riêng
export interface UserStyleDto {
  idUser: number;
  styles: CustomStyles;
}

// Nếu bạn chỉ cần theme + primaryColor (ví dụ default style)
export interface UserStyle {
  idUser: number;
  styles: {
    theme: "light" | "dark";
    primaryColor: string;
  };
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
  effectUsername?: string;
  location?: string;
};

export interface UserStyle {
  [key: string]: any;
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
  audioHeight?: string;
  audioWidth?: string;
  audioBorderRadius?: string;
  audioBoxShadow?: string;
  audioBackgroundColor?: string;
  audioProgressColor?: string;
  audioThumbColor?: string;
  audioControlsColor?: string;
  audioBorderStyle?: string;   
  audioBorderWidth?: string;  
  audioBorderColor?: string; 
}