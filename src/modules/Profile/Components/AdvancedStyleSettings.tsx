import React, { useEffect, useState } from "react";
import "rc-slider/assets/index.css";
import StyleInputGroup from "./StyleInputGroup";
import StylePreview from "./StylePreview";
import { type AdvancedStyleSettingsProps } from "../../../types";
import { fetchUserStyles, getDefaultStyles } from "../services/styleService";
import {
  BORDER_STYLE_OPTIONS,
  BASIC_BORDER_STYLE_OPTIONS,
  AVATAR_SHAPE_OPTIONS,
  FONT_STYLE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  BASIC_FONT_WEIGHT_OPTIONS,
  TEXT_TRANSFORM_OPTIONS,
  CURSOR_TYPE_OPTIONS,
  OBJECT_FIT_OPTIONS,
} from "../constants/styleOptions";

const AdvancedStyleSettings: React.FC<AdvancedStyleSettingsProps> = ({
  customStyles,
  handleStyleChange,
  stylesLoading,
  userId
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user styles khi component mount
  useEffect(() => {
    const loadUserStyles = async () => {
      if (userId && !isInitialized) {
        try {
          const userStyles = await fetchUserStyles(userId);
          // Merge với default styles để đảm bảo có đầy đủ properties
          const mergedStyles = { ...getDefaultStyles(), ...userStyles };
          
          // Apply styles to customStyles
          Object.entries(mergedStyles).forEach(([key, value]) => {
            handleStyleChange(key, value);
          });
          
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to load user styles:', error);
          setIsInitialized(true);
        }
      }
    };

    loadUserStyles();
  }, [userId, handleStyleChange, isInitialized]);

  return (
    <div className="mt-8 mx-4 sm:mx-8">
      <div className="bg-gray-900/60 rounded-2xl p-6 border border-purple-500/30 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3">
          🎨 Advanced Style Settings {stylesLoading && "(Loading...)"}
        </h2>

        {/* Profile Container */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-500/30 pb-2">
            📦 Profile Container
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StyleInputGroup
              label="Border Width"
              value={parseInt(customStyles.profileBorderWidth?.replace("px", "") || "1")}
              onChange={(value) => handleStyleChange("profileBorderWidth", `${value}px`)}
              type="slider"
              min={0}
              max={10}
              step={1}
            />
            <StyleInputGroup
              label="Border Style"
              value={customStyles.profileBorderStyle || "solid"}
              onChange={(value) => handleStyleChange("profileBorderStyle", value)}
              type="select"
              options={BORDER_STYLE_OPTIONS}
            />
            <StyleInputGroup
              label="Border Color"
              value={customStyles.profileBorderColor || "#8b5cf6"}
              onChange={(value) => handleStyleChange("profileBorderColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Border Radius"
              value={parseInt(customStyles.profileBorderRadius?.replace("px", "") || "0")}
              onChange={(value) => handleStyleChange("profileBorderRadius", `${value}px`)}
              type="slider"
              min={0}
              max={50}
              step={1}
            />
            <StyleInputGroup
              label="Padding"
              value={parseInt(customStyles.profilePadding?.replace("px", "") || "16")}
              onChange={(value) => handleStyleChange("profilePadding", `${value}px`)}
              type="slider"
              min={8}
              max={48}
              step={1}
            />
            <StyleInputGroup
              label="Background Color"
              value={customStyles.profileBackgroundColor || "#1f2937"}
              onChange={(value) => handleStyleChange("profileBackgroundColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Opacity"
              value={customStyles.profileOpacity ?? 1}
              onChange={(value) => handleStyleChange("profileOpacity", value)}
              type="slider"
              min={0}
              max={1}
              step={0.1}
            />
            <StyleInputGroup
              label="Box Shadow"
              value={customStyles.profileBoxShadow || "0 20px 25px -5px rgba(0, 0, 0, 0.1)"}
              onChange={(value) => handleStyleChange("profileBoxShadow", value)}
              type="text"
              placeholder="0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>

        {/* Avatar */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-green-300 border-b border-green-500/30 pb-2">
            👤 Avatar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StyleInputGroup
              label="Shape"
              value={customStyles.avatarBorderRadius === "50%" ? "circle" : "square"}
              onChange={(value) =>
                handleStyleChange("avatarBorderRadius", value === "circle" ? "50%" : "8px")
              }
              type="select"
              options={AVATAR_SHAPE_OPTIONS}
            />
            <StyleInputGroup
              label="Show Border"
              value={customStyles.avatarShowBorder ?? false}
              onChange={(value) => handleStyleChange("avatarShowBorder", value)}
              type="checkbox"
            />
            <StyleInputGroup
              label="Border Width"
              value={parseInt(customStyles.avatarBorderWidth?.replace("px", "") || "0")}
              onChange={(value) => handleStyleChange("avatarBorderWidth", `${value}px`)}
              type="slider"
              min={0}
              max={10}
              step={1}
              disabled={!customStyles.avatarShowBorder}
            />
            <StyleInputGroup
              label="Border Style"
              value={customStyles.avatarBorderStyle || "solid"}
              onChange={(value) => handleStyleChange("avatarBorderStyle", value)}
              type="select"
              options={BASIC_BORDER_STYLE_OPTIONS}
              disabled={!customStyles.avatarShowBorder}
            />
            <StyleInputGroup
              label="Border Color"
              value={customStyles.avatarBorderColor || "#ffffff"}
              onChange={(value) => handleStyleChange("avatarBorderColor", value)}
              type="color"
              disabled={!customStyles.avatarShowBorder}
            />
          </div>
        </div>

        {/* Username */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-yellow-300 border-b border-yellow-500/30 pb-2">
            ✨ Username
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StyleInputGroup
              label="Font Size"
              value={parseInt(customStyles.usernameFontSize?.replace("px", "") || "16")}
              onChange={(value) => handleStyleChange("usernameFontSize", `${value}px`)}
              type="slider"
              min={12}
              max={48}
              step={1}
            />
            <StyleInputGroup
              label="Font Style"
              value={customStyles.usernameFontStyle || "normal"}
              onChange={(value) => handleStyleChange("usernameFontStyle", value)}
              type="select"
              options={FONT_STYLE_OPTIONS}
            />
            <StyleInputGroup
              label="Font Weight"
              value={customStyles.usernameFontWeight || "600"}
              onChange={(value) => handleStyleChange("usernameFontWeight", value)}
              type="select"
              options={FONT_WEIGHT_OPTIONS}
            />
            <StyleInputGroup
              label="Color"
              value={customStyles.usernameColor || "#ffffff"}
              onChange={(value) => handleStyleChange("usernameColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Text Shadow"
              value={customStyles.usernameTextShadow || "0 0 10px rgba(139, 92, 246, 0.5)"}
              onChange={(value) => handleStyleChange("usernameTextShadow", value)}
              type="text"
              placeholder="0 0 10px rgba(139, 92, 246, 0.5)"
            />
            <StyleInputGroup
              label="Text Transform"
              value={customStyles.usernameTextTransform || "none"}
              onChange={(value) => handleStyleChange("usernameTextTransform", value)}
              type="select"
              options={TEXT_TRANSFORM_OPTIONS}
            />
            <StyleInputGroup
              label="Letter Spacing"
              value={parseFloat(customStyles.usernameLetterSpacing?.replace("px", "") || "0")}
              onChange={(value) => handleStyleChange("usernameLetterSpacing", `${value}px`)}
              type="slider"
              min={-2}
              max={10}
              step={0.1}
            />
          </div>
        </div>

        {/* Location */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-red-300 border-b border-red-500/30 pb-2">
            📍 Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StyleInputGroup
              label="Font Size"
              value={parseInt(customStyles.locationFontSize?.replace("px", "") || "14")}
              onChange={(value) => handleStyleChange("locationFontSize", `${value}px`)}
              type="slider"
              min={10}
              max={24}
              step={1}
            />
            <StyleInputGroup
              label="Color"
              value={customStyles.locationColor || "#9ca3af"}
              onChange={(value) => handleStyleChange("locationColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Font Style"
              value={customStyles.locationFontStyle || "normal"}
              onChange={(value) => handleStyleChange("locationFontStyle", value)}
              type="select"
              options={FONT_STYLE_OPTIONS}
            />
          </div>
        </div>

        {/* Custom Cursor */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-indigo-500/30 pb-2">
            🖱️ Custom Cursor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StyleInputGroup
              label="Cursor Type"
              value={customStyles.cursorType || "pointer"}
              onChange={(value) => handleStyleChange("cursorType", value)}
              type="select"
              options={CURSOR_TYPE_OPTIONS}
            />
            <StyleInputGroup
              label="Color"
              value={customStyles.cursorColor || "#ffffff"}
              onChange={(value) => handleStyleChange("cursorColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Font Size"
              value={parseInt(customStyles.cursorFontSize?.replace("px", "") || "12")}
              onChange={(value) => handleStyleChange("cursorFontSize", `${value}px`)}
              type="slider"
              min={8}
              max={20}
              step={1}
            />
            <StyleInputGroup
              label="Font Weight"
              value={customStyles.cursorFontWeight || "400"}
              onChange={(value) => handleStyleChange("cursorFontWeight", value)}
              type="select"
              options={BASIC_FONT_WEIGHT_OPTIONS}
            />
          </div>
        </div>

        {/* Audio Title */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-pink-300 border-b border-pink-500/30 pb-2">
            🎵 Audio Title
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StyleInputGroup
              label="Font Size"
              value={parseInt(customStyles.audioTitleFontSize?.replace("px", "") || "16")}
              onChange={(value) => handleStyleChange("audioTitleFontSize", `${value}px`)}
              type="slider"
              min={12}
              max={32}
              step={1}
            />
            <StyleInputGroup
              label="Font Weight"
              value={customStyles.audioTitleFontWeight || "400"}
              onChange={(value) => handleStyleChange("audioTitleFontWeight", value)}
              type="select"
              options={FONT_WEIGHT_OPTIONS}
            />
            <StyleInputGroup
              label="Color"
              value={customStyles.audioTitleColor || "#ffffff"}
              onChange={(value) => handleStyleChange("audioTitleColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Letter Spacing"
              value={parseFloat(customStyles.audioTitleLetterSpacing?.replace("px", "") || "0")}
              onChange={(value) => handleStyleChange("audioTitleLetterSpacing", `${value}px`)}
              type="slider"
              min={-1}
              max={5}
              step={0.1}
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300 border-b border-cyan-500/30 pb-2">
            🖼️ Cover Image
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StyleInputGroup
              label="Width"
              value={parseInt(customStyles.coverImageWidth?.replace("px", "") || "45")}
              onChange={(value) => handleStyleChange("coverImageWidth", `${value}px`)}
              type="slider"
              min={30}
              max={200}
              step={5}
            />
            <StyleInputGroup
              label="Height"
              value={parseInt(customStyles.coverImageHeight?.replace("px", "") || "45")}
              onChange={(value) => handleStyleChange("coverImageHeight", `${value}px`)}
              type="slider"
              min={30}
              max={200}
              step={5}
            />
            <StyleInputGroup
              label="Border Radius"
              value={parseInt(customStyles.coverImageBorderRadius?.replace("px", "") || "8")}
              onChange={(value) => handleStyleChange("coverImageBorderRadius", `${value}px`)}
              type="slider"
              min={0}
              max={50}
              step={1}
            />
            <StyleInputGroup
              label="Border Width"
              value={parseInt(customStyles.coverImageBorderWidth?.replace("px", "") || "0")}
              onChange={(value) => handleStyleChange("coverImageBorderWidth", `${value}px`)}
              type="slider"
              min={0}
              max={10}
              step={1}
            />
            <StyleInputGroup
              label="Border Style"
              value={customStyles.coverImageBorderStyle || "solid"}
              onChange={(value) => handleStyleChange("coverImageBorderStyle", value)}
              type="select"
              options={BASIC_BORDER_STYLE_OPTIONS}
            />
            <StyleInputGroup
              label="Border Color"
              value={customStyles.coverImageBorderColor || "#ffffff"}
              onChange={(value) => handleStyleChange("coverImageBorderColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Object Fit"
              value={customStyles.coverImageObjectFit || "cover"}
              onChange={(value) => handleStyleChange("coverImageObjectFit", value)}
              type="select"
              options={OBJECT_FIT_OPTIONS}
            />
            <StyleInputGroup
              label="Box Shadow"
              value={customStyles.coverImageBoxShadow || "0 10px 15px -3px rgba(0, 0, 0, 0.1)"}
              onChange={(value) => handleStyleChange("coverImageBoxShadow", value)}
              type="text"
              placeholder="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>

        {/* Style Preview */}
        <StylePreview customStyles={customStyles} />
      </div>
    </div>
  );
};

export default AdvancedStyleSettings;