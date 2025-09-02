import React from "react";
import { type ProfileData, type UserStyle } from "../types/profile";

interface ProfileDescriptionProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const wrapText = (text: string, maxChars: number) => {
  const regex = new RegExp(`(.{1,${maxChars}})`, "g");
  return text.match(regex)?.join("\n") || text;
};

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({ profile, parsedStyles }) => {
  if (!profile.description) return null;

  const wrappedDescription = wrapText(profile.description, 30);

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
        whiteSpace: "pre-wrap", 
      }}
    >
      {wrappedDescription}
    </p>
  );
};

export default ProfileDescription;
