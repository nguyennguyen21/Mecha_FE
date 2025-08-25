// utils/styleUtils.ts
import { type UserStyle,type  ProfileData } from '../types/profile';

export const parseStyles = (data: any): UserStyle => {
  if (!data) return {};
  
  // Handle case where styles are nested in 'styles' property
  let stylesData = data;
  if (data.styles) {
    stylesData = data.styles;
  }
  
  if (typeof stylesData === 'string') {
    try {
      return JSON.parse(stylesData);
    } catch (err) {
      console.warn('Failed to parse style data:', err);
      return {};
    }
  }
  return stylesData || {};
};

export const createContainerStyle = (parsedStyles: UserStyle): React.CSSProperties => ({
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  backgroundColor: parsedStyles?.profileBackgroundColor || "#fff",
  color: "#000",
  border: parsedStyles?.profileBorderStyle && parsedStyles?.profileBorderWidth && parsedStyles?.profileBorderColor 
    ? `${parsedStyles.profileBorderWidth} ${parsedStyles.profileBorderStyle} ${parsedStyles.profileBorderColor}` 
    : "2px solid #888",
  padding: parsedStyles?.profilePadding || "20px",
  borderRadius: parsedStyles?.profileBorderRadius || "10px",
  fontFamily: "Arial, sans-serif",
  boxShadow: parsedStyles?.profileBoxShadow || "0 4px 12px rgba(0,0,0,0.2)",
  opacity: parsedStyles?.profileOpacity ?? 1,
  overflow: "hidden",
});

export const createAvatarStyle = (parsedStyles: UserStyle, profile: ProfileData): React.CSSProperties => ({
  width: "120px",
  height: "120px",
  borderRadius: parsedStyles?.avatarBorderRadius || "50%",
  border: parsedStyles?.avatarShowBorder && parsedStyles?.avatarBorderWidth && parsedStyles?.avatarBorderStyle && parsedStyles?.avatarBorderColor
    ? `${parsedStyles.avatarBorderWidth} ${parsedStyles.avatarBorderStyle} ${parsedStyles.avatarBorderColor}`
    : "4px solid #888",
  objectFit: "cover",
  boxShadow: profile.effectUsername === "glow" 
    ? `0 0 15px ${parsedStyles?.usernameColor || "#888"}` 
    : "none",
});

export const createUsernameStyle = (parsedStyles: UserStyle, profile: ProfileData): React.CSSProperties => ({
  color: parsedStyles?.usernameColor || "#888",
  textShadow: parsedStyles?.usernameTextShadow || (profile.effectUsername === "glow" ? `0 0 10px ${parsedStyles?.usernameColor || "#888"}` : "none"),
  fontSize: parsedStyles?.usernameFontSize || "clamp(20px, 5vw, 32px)",
  fontWeight: parsedStyles?.usernameFontWeight || 700,
  fontStyle: parsedStyles?.usernameFontStyle || "normal",
  textTransform: parsedStyles?.usernameTextTransform as any || "none",
  letterSpacing: parsedStyles?.usernameLetterSpacing || "normal",
  margin: "10px 0",
});

export const createLocationStyle = (parsedStyles: UserStyle): React.CSSProperties => ({
  fontSize: parsedStyles?.locationFontSize || "clamp(12px, 2.5vw, 18px)",
  color: parsedStyles?.locationColor || "#555",
  fontStyle: parsedStyles?.locationFontStyle || "italic",
  marginBottom: "10px",
});