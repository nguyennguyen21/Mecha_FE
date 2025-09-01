import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import {
  FONT_STYLE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  TEXT_TRANSFORM_OPTIONS
} from "../../constants/styleOptions";

interface UsernameSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const UsernameSection: React.FC<UsernameSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
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
  );
};

export default UsernameSection;