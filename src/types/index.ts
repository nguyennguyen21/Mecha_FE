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

export interface FileState {
  profileAvatar: string;
  background: string;
  audio: string;
  audioImage: string;
}

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
  usernameTextTransform: string;
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

  cursorType?: string;
  cursorFontSize?: string;
  cursorFontWeight?: string;
  cursorColor?: string;

  cursorWidth?: string;
  cursorHeight?: string;
}


export interface ProfileData {
  userId: number;
  styleId?: string;
  profileAvatar?: string;
  background?: string;
  audio?: string;
  audioImage?: string;
  audioTitle?: string;
  customCursor?: string;
  description?: string;
  username?: string;
  effectUsername?: string;
  location?: string;
}

export interface UserStyleDto {
  IdUser: number;
  Styles: CustomStyles;
}

// src/types.ts
export interface ProfileData {
  userId: number;
  styleId?: string;
  profileAvatar?: string;
  background?: string;
  audio?: string;
  audioImage?: string;
  audioTitle?: string;
  customCursor?: string;
  description?: string;
  username?: string;
  effectUsername?: string;
  location?: string;
}

export interface UserStyle {
  idUser: number;
  styles: {
    theme: "light" | "dark";
    primaryColor: string;
  };
}
