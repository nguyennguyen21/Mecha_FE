import { type UserStyle, type ProfileData } from "../../../types/index";

export const createUsernameStyle = (parsedStyles: UserStyle, profile: ProfileData) => {
  return {
    fontSize: parsedStyles.usernameFontSize || "16px",
    fontStyle: parsedStyles.usernameFontStyle || "normal",
    fontWeight: parsedStyles.usernameFontWeight || "400",
    color: parsedStyles.usernameColor || "#000",
  } as React.CSSProperties;
};
