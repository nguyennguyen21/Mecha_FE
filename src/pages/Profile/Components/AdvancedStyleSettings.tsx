import React from "react";
import "rc-slider/assets/index.css";
import StyleInputGroup from "./StyleInputGroup";
import { type CustomStyles } from "../../../types";

interface AdvancedStyleSettingsProps {
  customStyles: CustomStyles;
  handleStyleChange: (styleKey: string, value: string | number | boolean) => void;
  stylesLoading: boolean;
  userId: number; 
}

const AdvancedStyleSettings: React.FC<AdvancedStyleSettingsProps> = ({
  customStyles,
  handleStyleChange,
  stylesLoading,
  userId,
}) => {
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
              value={customStyles.profileBorderStyle}
              onChange={(value) => handleStyleChange("profileBorderStyle", value)}
              type="select"
              options={[
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "dotted", label: "Dotted" },
                { value: "double", label: "Double" },
                { value: "groove", label: "Groove" },
                { value: "ridge", label: "Ridge" },
                { value: "inset", label: "Inset" },
                { value: "outset", label: "Outset" },
              ]}
            />
            <StyleInputGroup
              label="Border Color"
              value={customStyles.profileBorderColor}
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
              value={customStyles.profileBackgroundColor}
              onChange={(value) => handleStyleChange("profileBackgroundColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Opacity"
              value={customStyles.profileOpacity}
              onChange={(value) => handleStyleChange("profileOpacity", value)}
              type="slider"
              min={0}
              max={1}
              step={0.1}
            />
            <StyleInputGroup
              label="Box Shadow"
              value={customStyles.profileBoxShadow}
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
              options={[
                { value: "circle", label: "Circle (Tròn)" },
                { value: "square", label: "Square (Vuông)" },
              ]}
            />
            <StyleInputGroup
              label="Show Border"
              value={customStyles.avatarShowBorder}
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
              value={customStyles.avatarBorderStyle}
              onChange={(value) => handleStyleChange("avatarBorderStyle", value)}
              type="select"
              options={[
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "dotted", label: "Dotted" },
                { value: "double", label: "Double" },
              ]}
              disabled={!customStyles.avatarShowBorder}
            />
            <StyleInputGroup
              label="Border Color"
              value={customStyles.avatarBorderColor}
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
              value={customStyles.usernameFontStyle}
              onChange={(value) => handleStyleChange("usernameFontStyle", value)}
              type="select"
              options={[
                { value: "normal", label: "Normal" },
                { value: "italic", label: "Italic" },
                { value: "oblique", label: "Oblique" },
              ]}
            />
            <StyleInputGroup
              label="Font Weight"
              value={customStyles.usernameFontWeight}
              onChange={(value) => handleStyleChange("usernameFontWeight", value)}
              type="select"
              options={[
                { value: "300", label: "Light" },
                { value: "400", label: "Normal" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semi Bold" },
                { value: "700", label: "Bold" },
                { value: "800", label: "Extra Bold" },
              ]}
            />
            <StyleInputGroup
              label="Color"
              value={customStyles.usernameColor}
              onChange={(value) => handleStyleChange("usernameColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Text Shadow"
              value={customStyles.usernameTextShadow}
              onChange={(value) => handleStyleChange("usernameTextShadow", value)}
              type="text"
              placeholder="0 0 10px rgba(139, 92, 246, 0.5)"
            />
            <StyleInputGroup
              label="Text Transform"
              value={customStyles.usernameTextTransform}
              onChange={(value) => handleStyleChange("usernameTextTransform", value)}
              type="select"
              options={[
                { value: "none", label: "None" },
                { value: "uppercase", label: "UPPERCASE" },
                { value: "lowercase", label: "lowercase" },
                { value: "capitalize", label: "Capitalize" },
              ]}
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
              value={customStyles.locationColor}
              onChange={(value) => handleStyleChange("locationColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Font Style"
              value={customStyles.locationFontStyle}
              onChange={(value) => handleStyleChange("locationFontStyle", value)}
              type="select"
              options={[
                { value: "normal", label: "Normal" },
                { value: "italic", label: "Italic" },
                { value: "oblique", label: "Oblique" },
              ]}
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
              value={customStyles.cursorType ?? "pointer"}
              onChange={(value) => handleStyleChange("cursorType", value)}
              type="select"
              options={[
                { value: "crosshair", label: "Crosshair" },
                { value: "pointer", label: "Pointer" },
                { value: "move", label: "Move" },
                { value: "text", label: "Text" },
                { value: "wait", label: "Wait" },
                { value: "help", label: "Help" },
                { value: "grab", label: "Grab" },
              ]}
            />
            <StyleInputGroup
              label="Color"
              value={customStyles.cursorColor ?? "#ffffff"}
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
              value={customStyles.cursorFontWeight ?? "400"}
              onChange={(value) => handleStyleChange("cursorFontWeight", value)}
              type="select"
              options={[
                { value: "300", label: "Light" },
                { value: "400", label: "Normal" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semi Bold" },
                { value: "700", label: "Bold" },
              ]}
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
              value={customStyles.audioTitleFontWeight ?? "400"}
              onChange={(value) => handleStyleChange("audioTitleFontWeight", value)}
              type="select"
              options={[
                { value: "300", label: "Light" },
                { value: "400", label: "Normal" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semi Bold" },
                { value: "700", label: "Bold" },
                { value: "800", label: "Extra Bold" },
              ]}
            />
            <StyleInputGroup
              label="Color"
              value={customStyles.audioTitleColor ?? "#ffffff"}
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
              value={parseInt(customStyles.coverImageWidth?.replace("px", "") || "300")}
              onChange={(value) => handleStyleChange("coverImageWidth", `${value}px`)}
              type="slider"
              min={200}
              max={500}
              step={10}
            />
            <StyleInputGroup
              label="Height"
              value={parseInt(customStyles.coverImageHeight?.replace("px", "") || "300")}
              onChange={(value) => handleStyleChange("coverImageHeight", `${value}px`)}
              type="slider"
              min={200}
              max={500}
              step={10}
            />
            <StyleInputGroup
              label="Border Radius"
              value={parseInt(customStyles.coverImageBorderRadius?.replace("px", "") || "0")}
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
              value={customStyles.coverImageBorderStyle}
              onChange={(value) => handleStyleChange("coverImageBorderStyle", value)}
              type="select"
              options={[
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "dotted", label: "Dotted" },
                { value: "double", label: "Double" },
              ]}
            />
            <StyleInputGroup
              label="Border Color"
              value={customStyles.coverImageBorderColor}
              onChange={(value) => handleStyleChange("coverImageBorderColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Object Fit"
              value={customStyles.coverImageObjectFit}
              onChange={(value) => handleStyleChange("coverImageObjectFit", value)}
              type="select"
              options={[
                { value: "cover", label: "Cover" },
                { value: "contain", label: "Contain" },
                { value: "fill", label: "Fill" },
                { value: "scale-down", label: "Scale Down" },
                { value: "none", label: "None" },
              ]}
            />
            <StyleInputGroup
              label="Box Shadow"
              value={customStyles.coverImageBoxShadow}
              onChange={(value) => handleStyleChange("coverImageBoxShadow", value)}
              type="text"
              placeholder="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>

        {/* Style Preview */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-orange-300 border-b border-orange-500/30 pb-2">
            👁️ Preview
          </h3>

        </div>
      </div>
    </div>
  );
};

export default AdvancedStyleSettings;