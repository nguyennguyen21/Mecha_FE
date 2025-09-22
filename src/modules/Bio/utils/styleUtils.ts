// utils/styleUtils.ts
import { type UserStyle, type ProfileData } from '../types/profile';

export const parseStyles = (data: any): Partial<UserStyle> => {
  if (!data) return {};
  let stylesData = data.styles ?? data;
  if (typeof stylesData === 'string') {
    try {
      return JSON.parse(stylesData);
    } catch {
      return {};
    }
  }
  return stylesData || {};
};

// Helper function to parse margin string into individual values
const parseMargin = (marginString: string): { top: string, right: string, bottom: string, left: string } => {
  if (!marginString) return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
  
  // Clean up the margin string - fix common typos and formatting
  const cleanMargin = marginString.trim()
    .replace(/ox/g, 'px') // Fix "100ox" -> "100px"
    .replace(/(\d)\s+(\d)/g, '$1px $2') // Fix "0 100 0px" -> "0px 100px 0px"
    .replace(/^\s+/, ''); // Remove leading spaces
  
  const values = cleanMargin.split(/\s+/).filter(v => v.length > 0);
  
  // Ensure all values have units
  const addPxIfNeeded = (val: string) => {
    if (!val) return '0px';
    if (val === '0') return '0px';
    if (/^\d+$/.test(val)) return val + 'px';
    return val;
  };
  
  switch (values.length) {
    case 1:
      const all = addPxIfNeeded(values[0]);
      return { top: all, right: all, bottom: all, left: all };
    case 2:
      const vertical = addPxIfNeeded(values[0]);
      const horizontal = addPxIfNeeded(values[1]);
      return { top: vertical, right: horizontal, bottom: vertical, left: horizontal };
    case 3:
      return { 
        top: addPxIfNeeded(values[0]), 
        right: addPxIfNeeded(values[1]), 
        bottom: addPxIfNeeded(values[2]), 
        left: addPxIfNeeded(values[1]) 
      };
    case 4:
    default:
      return { 
        top: addPxIfNeeded(values[0] || '0'), 
        right: addPxIfNeeded(values[1] || '0'), 
        bottom: addPxIfNeeded(values[2] || '0'), 
        left: addPxIfNeeded(values[3] || '0') 
      };
  }
};

// Helper function to get margin values (supports both individual and combined margin)
const getMarginValues = (parsedStyles: UserStyle, prefix: string) => {
  const combinedMargin = parsedStyles[`${prefix}Margin`];
  if (combinedMargin) {
    return parseMargin(combinedMargin);
  }
  
  return {
    top: parsedStyles[`${prefix}MarginTop`] ?? '0px',
    right: parsedStyles[`${prefix}MarginRight`] ?? '0px',
    bottom: parsedStyles[`${prefix}MarginBottom`] ?? '0px',
    left: parsedStyles[`${prefix}MarginLeft`] ?? '0px',
  };
};

// Container
export const createContainerStyle = (parsedStyles: UserStyle): React.CSSProperties => ({
  position: "relative",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

// Sub-container
export const subContainer = (parsedStyles: UserStyle, profile: ProfileData): React.CSSProperties => ({
  display: "flex",
  flexDirection: parsedStyles?.containerFlexDirection ?? "column",
  alignItems: parsedStyles?.containerAlignItems ?? "center",
  justifyContent: parsedStyles?.containerJustifyContent ?? "center",
  textAlign: parsedStyles?.containerTextAlign ?? "center",
  flexWrap: parsedStyles?.containerFlexWrap ?? "nowrap",
  gap: parsedStyles?.containerGap ?? "8px",
  backgroundColor: parsedStyles?.profileBackgroundColor?.trim() || "transparent",
  border: `${parsedStyles?.profileBorderWidth ?? "1px"} ${parsedStyles?.profileBorderStyle ?? "solid"} ${parsedStyles?.profileBorderColor ?? "#8b5cf6"}`,
  borderRadius: parsedStyles?.profileBorderRadius ?? "16px",
  padding: parsedStyles?.profilePadding ?? "16px",
  opacity: parsedStyles?.profileOpacity ?? 1,
  boxShadow: parsedStyles?.profileBoxShadow ?? "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
});

// Avatar
export const createAvatarStyle = (parsedStyles: UserStyle, profile: ProfileData): React.CSSProperties => {
  const margin = getMarginValues(parsedStyles, 'avatar');
  
  return {
    width: "80px",
    height: "80px",
    borderRadius: parsedStyles?.avatarBorderRadius || "50%",
    border: parsedStyles?.avatarShowBorder
      ? `${parsedStyles.avatarBorderWidth} ${parsedStyles.avatarBorderStyle} ${parsedStyles.avatarBorderColor}`
      : "4px solid #888",
    objectFit: "cover",
    boxShadow: profile.effectUsername === "glow" 
      ? `0 0 15px ${parsedStyles?.usernameColor || "#888"}` 
      : "none",
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };
};

// Username
export const createUsernameStyle = (parsedStyles: UserStyle, profile: ProfileData): React.CSSProperties => {
  const margin = getMarginValues(parsedStyles, 'username');
  
  return {
    color: parsedStyles?.usernameColor || "#fff",
    textShadow: parsedStyles?.usernameTextShadow || (profile.effectUsername === "glow" ? `0 0 10px ${parsedStyles?.usernameColor || "#fff"}` : "none"),
    fontSize: parsedStyles?.usernameFontSize || "clamp(20px, 5vw, 32px)",
    fontWeight: parsedStyles?.usernameFontWeight || 700,
    fontStyle: parsedStyles?.usernameFontStyle || "normal",
    textTransform: parsedStyles?.usernameTextTransform as any || "none",
    letterSpacing: parsedStyles?.usernameLetterSpacing || "normal",
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };
};

// Description
export const createDescriptionStyle = (parsedStyles: UserStyle): React.CSSProperties => {
  const margin = getMarginValues(parsedStyles, 'description');
  
  return {
    fontSize: parsedStyles?.descriptionFontSize || "clamp(14px, 3vw, 18px)",
    color: parsedStyles?.descriptionColor || "#ccc",
    textAlign: parsedStyles?.descriptionTextAlign || "center",
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };
};

// Social Links
export const createSocialLinksStyle = (parsedStyles: UserStyle): React.CSSProperties => {
  const margin = getMarginValues(parsedStyles, 'socialLinks');
  
  return {
    display: "flex",
    gap: parsedStyles?.socialLinksGap ?? "8px",
    justifyContent: parsedStyles?.socialLinksJustify ?? "center",
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };
};

// Location
export const createLocationStyle = (parsedStyles: UserStyle): React.CSSProperties => {
  const margin = getMarginValues(parsedStyles, 'location');
  
  return {
    fontSize: parsedStyles?.locationFontSize || "clamp(12px, 2.5vw, 16px)",
    color: parsedStyles?.locationColor || "#aaa",
    fontStyle: parsedStyles?.locationFontStyle || "italic",
    fontWeight: parsedStyles?.locationFontWeight ?? "400",
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };
};

// Audio
export const createAudioStyle = (parsedStyles: UserStyle): React.CSSProperties => {
  const margin = getMarginValues(parsedStyles, 'audio');
  
  return {
    width: parsedStyles?.audioWidth ?? "100%",
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };
};

// Cursor
export const getCursorType = (parsedStyles: UserStyle): string => parsedStyles?.cursorType || "default";