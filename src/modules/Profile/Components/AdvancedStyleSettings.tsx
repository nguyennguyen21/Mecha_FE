import React, { useEffect, useState } from "react";
import "rc-slider/assets/index.css";
import StyleInputGroup from "./StyleInputGroup";
import { type CustomStyles } from "../../../types";

interface AdvancedStyleSettingsProps {
  customStyles: CustomStyles;
  handleStyleChange: (styleKey: string, value: string | number | boolean) => void;
  stylesLoading: boolean;
  userId: number; 
}

// API service để fetch user styles
const fetchUserStyles = async (userId: number): Promise<CustomStyles> => {
  try {
    const response = await fetch(`http://localhost:5159/api/UserStyles/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Giả sử API trả về dạng { idUser: number, styles: CustomStyles }
    return data.styles || {};
  } catch (error) {
    console.error('Error fetching user styles:', error);
    // Trả về default styles nếu có lỗi
    return getDefaultStyles();
  }
};

// Default styles fallback
const getDefaultStyles = (): CustomStyles => ({
  profileBorderWidth: "1px",
  profileBorderStyle: "solid",
  profileBorderColor: "#8b5cf6",
  profileBorderRadius: "16px",
  profilePadding: "16px",
  profileBackgroundColor: "#1f2937",
  profileOpacity: 1,
  profileBoxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",

  avatarBorderRadius: "50%",
  avatarShowBorder: false,
  avatarBorderWidth: "0px",
  avatarBorderStyle: "solid",
  avatarBorderColor: "#ffffff",

  usernameFontSize: "16px",
  usernameFontStyle: "normal",
  usernameFontWeight: "600",
  usernameColor: "#ffffff",
  usernameTextShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
  usernameTextTransform: "none",
  usernameLetterSpacing: "0px",

  locationFontSize: "14px",
  locationColor: "#9ca3af",
  locationFontStyle: "normal",

  cursorType: "pointer",
  cursorColor: "#ffffff",
  cursorFontSize: "12px",
  cursorFontWeight: "400",

  audioTitleFontSize: "16px",
  audioTitleFontWeight: "400",
  audioTitleColor: "#ffffff",
  audioTitleLetterSpacing: "0px",

  coverImageWidth: "45px",
  coverImageHeight: "45px",
  coverImageBorderRadius: "8px",
  coverImageBorderWidth: "0px",
  coverImageBorderStyle: "solid",
  coverImageBorderColor: "#ffffff",
  coverImageObjectFit: "cover",
  coverImageBoxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
});

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

  // Hàm tạo preview style object
  const getPreviewStyles = () => {
    return {
      border: `${customStyles.profileBorderWidth} ${customStyles.profileBorderStyle} ${customStyles.profileBorderColor}`,
      borderRadius: customStyles.profileBorderRadius,
      padding: customStyles.profilePadding,
      backgroundColor: customStyles.profileBackgroundColor,
      opacity: customStyles.profileOpacity,
      boxShadow: customStyles.profileBoxShadow,
    };
  };

  const getAvatarPreviewStyles = () => {
    return {
      borderRadius: customStyles.avatarBorderRadius,
      border: customStyles.avatarShowBorder 
        ? `${customStyles.avatarBorderWidth} ${customStyles.avatarBorderStyle} ${customStyles.avatarBorderColor}`
        : 'none',
    };
  };

  const getUsernamePreviewStyles = () => {
    return {
      fontSize: customStyles.usernameFontSize,
      fontStyle: customStyles.usernameFontStyle,
      fontWeight: customStyles.usernameFontWeight,
      color: customStyles.usernameColor,
      textShadow: customStyles.usernameTextShadow,
      textTransform: customStyles.usernameTextTransform as any,
      letterSpacing: customStyles.usernameLetterSpacing,
    };
  };

  const getLocationPreviewStyles = () => {
    return {
      fontSize: customStyles.locationFontSize,
      color: customStyles.locationColor,
      fontStyle: customStyles.locationFontStyle,
    };
  };

  const getAudioTitlePreviewStyles = () => {
    return {
      fontSize: customStyles.audioTitleFontSize,
      fontWeight: customStyles.audioTitleFontWeight,
      color: customStyles.audioTitleColor,
      letterSpacing: customStyles.audioTitleLetterSpacing,
    };
  };

  const getCoverImagePreviewStyles = () => {
    return {
      width: customStyles.coverImageWidth,
      height: customStyles.coverImageHeight,
      borderRadius: customStyles.coverImageBorderRadius,
      border: `${customStyles.coverImageBorderWidth} ${customStyles.coverImageBorderStyle} ${customStyles.coverImageBorderColor}`,
      objectFit: customStyles.coverImageObjectFit as any,
      boxShadow: customStyles.coverImageBoxShadow,
    };
  };

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
              options={[
                { value: "circle", label: "Circle (Tròn)" },
                { value: "square", label: "Square (Vuông)" },
              ]}
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
              options={[
                { value: "normal", label: "Normal" },
                { value: "italic", label: "Italic" },
                { value: "oblique", label: "Oblique" },
              ]}
            />
            <StyleInputGroup
              label="Font Weight"
              value={customStyles.usernameFontWeight || "600"}
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
              value={customStyles.locationColor || "#9ca3af"}
              onChange={(value) => handleStyleChange("locationColor", value)}
              type="color"
            />
            <StyleInputGroup
              label="Font Style"
              value={customStyles.locationFontStyle || "normal"}
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
              value={customStyles.cursorType || "pointer"}
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
              value={customStyles.audioTitleFontWeight || "400"}
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
              options={[
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "dotted", label: "Dotted" },
                { value: "double", label: "Double" },
              ]}
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
              value={customStyles.coverImageBoxShadow || "0 10px 15px -3px rgba(0, 0, 0, 0.1)"}
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
          
          {/* Preview Container */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div style={getPreviewStyles()} className="max-w-md mx-auto">
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar Preview */}
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl"
                  style={getAvatarPreviewStyles()}
                >
                  U
                </div>
                
                <div>
                  {/* Username Preview */}
                  <div style={getUsernamePreviewStyles()}>
                    Sample Username
                  </div>
                  {/* Location Preview */}
                  <div style={getLocationPreviewStyles()}>
                    📍 Ho Chi Minh City
                  </div>
                </div>
              </div>
              
              {/* Audio Section Preview */}
              <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                {/* Cover Image Preview */}
                <div 
                  className="bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold"
                  style={getCoverImagePreviewStyles()}
                >
                  🎵
                </div>
                
                <div>
                  {/* Audio Title Preview */}
                  <div style={getAudioTitlePreviewStyles()}>
                    Sample Audio Title
                  </div>
                  <div className="text-gray-400 text-sm">Artist Name</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStyleSettings;