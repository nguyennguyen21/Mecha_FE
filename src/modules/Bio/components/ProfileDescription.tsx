import React from "react";
import { type ProfileData, type UserStyle } from "../types/profile";

interface ProfileDescriptionProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({ profile, parsedStyles }) => {
  if (!profile.description) return null;

  return (
    <p
      style={{
        fontSize: parsedStyles.descFontSize || "16px",
        fontStyle: parsedStyles.descFontStyle || "normal",
        fontWeight: parsedStyles.descFontWeight || "400",
        color: parsedStyles.descColor || "#ffffff",
        textShadow: parsedStyles.descTextShadow || "none",
        textTransform: parsedStyles.descTextTransform || "none",
        letterSpacing: parsedStyles.descLetterSpacing || "0px",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        lineHeight: 1.4,
        whiteSpace: "pre-wrap", // giữ xuống dòng nếu có
      }}
    >
      {profile.description}
    </p>
  );
};

export default ProfileDescription;
