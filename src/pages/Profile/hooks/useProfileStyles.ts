import { useState, useCallback } from "react";
import { type CustomStyles } from "../../../types";

export const useProfileStyles = () => {
  const [customStyles, setCustomStyles] = useState<CustomStyles>({
    profileBorderStyle: "solid",
    profileBorderWidth: "1px",
    profileBorderColor: "rgba(139, 92, 246, 0.3)",
    profileBorderRadius: "16px",
    profilePadding: "24px",
    profileBackgroundColor: "rgba(31, 41, 55, 0.8)",
    profileOpacity: 1,
    profileBoxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    avatarBorderRadius: "50%",
    avatarShowBorder: true,
    avatarBorderStyle: "solid",
    avatarBorderWidth: "3px",
    avatarBorderColor: "rgba(139, 92, 246, 0.5)",
    usernameFontSize: "24px",
    usernameFontStyle: "normal",
    usernameFontWeight: "600",
    usernameColor: "#8b5cf6",
    usernameTextShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
    usernameTextTransform: "none",
    usernameLetterSpacing: "0.5px",
    locationFontSize: "14px",
    locationColor: "#9ca3af",
    locationFontStyle: "italic",
    cursorWidth: "20px",
    cursorHeight: "20px",
    cursorType: "crosshair",
    cursorColor: "#8b5cf6",
    cursorFontSize: "12px",
    cursorFontWeight: "500",
    audioTitleFontSize: "18px",
    audioTitleFontWeight: "500",
    audioTitleColor: "#ffffff",
    audioTitleLetterSpacing: "0.3px",
    coverImageWidth: "300px",
    coverImageHeight: "300px",
    coverImageBorderRadius: "12px",
    coverImageObjectFit: "cover",
    coverImageBorderStyle: "solid",
    coverImageBorderWidth: "2px",
    coverImageBorderColor: "rgba(139, 92, 246, 0.3)",
    coverImageBoxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  });

  const handleStyleChange = useCallback((styleKey: string, value: string | number | boolean) => {
    setCustomStyles((prev) => ({ ...prev, [styleKey]: value }));
  }, []);

  return {
    customStyles,
    setCustomStyles,
    handleStyleChange,
  };
};