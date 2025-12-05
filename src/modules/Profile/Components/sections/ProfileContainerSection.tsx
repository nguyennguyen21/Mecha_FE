import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import { BORDER_STYLE_OPTIONS } from "../../constants/styleOptions";
import "bootstrap-icons/font/bootstrap-icons.css";

interface ProfileContainerSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const ProfileContainerSection: React.FC<ProfileContainerSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  // Default values for container styles
  const defaultContainerStyles = {
    profileBorderWidth: "1px",
    profileBorderStyle: "solid",
    profileBorderColor: "rgba(139, 92, 246, 0.3)",
    profileBorderRadius: "16px",
    profileGap: "16px",
    profilePadding: "24px",
    profileBackgroundColor: "rgba(31, 41, 55, 0.8)",
    profileOpacity: 1,
    profileBoxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  };

  const handleReset = () => {
    Object.entries(defaultContainerStyles).forEach(([key, value]) => {
      handleStyleChange(key, value);
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <i className="fas fa-square text-blue-400 text-xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Container</h3>
            <p className="text-gray-400 text-sm">Customize the main profile container</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all duration-300 text-sm font-medium"
        >
          <i className="bi bi-arrow-counterclockwise"></i>
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Border Width */}
        <StyleInputGroup
          label="Border Width"
          value={parseInt(customStyles.profileBorderWidth?.replace("px", "") || "1")}
          onChange={(value) => handleStyleChange("profileBorderWidth", `${value}px`)}
          type="slider"
          min={0}
          max={10}
          step={1}
        />

        {/* Border Style */}
        <StyleInputGroup
          label="Border Style"
          value={customStyles.profileBorderStyle || "solid"}
          onChange={(value) => handleStyleChange("profileBorderStyle", value)}
          type="select"
          options={BORDER_STYLE_OPTIONS}
        />

        {/* Border Color */}
        <StyleInputGroup
          label="Border Color"
          value={customStyles.profileBorderColor || "#8b5cf6"}
          onChange={(value) => handleStyleChange("profileBorderColor", value)}
          type="color"
        />

        {/* Border Radius */}
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
          label="Gap"
          value={parseInt(customStyles.profileGap?.replace("px", "") || "16")}
          onChange={(value) => handleStyleChange("profileGap", `${value}px`)}
          type="slider"
          min={0}
          max={64}
          step={1}
        />

        {/* Padding */}
        <StyleInputGroup
          label="Padding"
          value={parseInt(customStyles.profilePadding?.replace("px", "") || "16")}
          onChange={(value) => handleStyleChange("profilePadding", `${value}px`)}
          type="slider"
          min={8}
          max={48}
          step={1}
        />

        {/* Background Color + Clear */}
        <div className="flex items-center gap-2">
          <StyleInputGroup
            label="Background Color"
            value={customStyles.profileBackgroundColor || "#1f2937"}
            onChange={(value) => handleStyleChange("profileBackgroundColor", value)}
            type="color"
          />
          <button
            type="button"
            className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            onClick={() => handleStyleChange("profileBackgroundColor", "transparent")}
          >
            Clear
          </button>
        </div>

        {/* Opacity */}
        <StyleInputGroup
          label="Opacity"
          value={customStyles.profileOpacity ?? 1}
          onChange={(value) => handleStyleChange("profileOpacity", value)}
          type="slider"
          min={0}
          max={1}
          step={0.1}
        />

        {/* Box Shadow */}
        <StyleInputGroup
          label="Box Shadow"
          value={customStyles.profileBoxShadow || "0 20px 25px -5px rgba(0, 0, 0, 0.1)"}
          onChange={(value) => handleStyleChange("profileBoxShadow", value)}
          type="text"
          placeholder="0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        />
      </div>
    </div>
  );
};

export default ProfileContainerSection;
