import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import { BORDER_STYLE_OPTIONS } from "../../constants/styleOptions";

interface ProfileContainerSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const ProfileContainerSection: React.FC<ProfileContainerSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
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
  );
};

export default ProfileContainerSection;