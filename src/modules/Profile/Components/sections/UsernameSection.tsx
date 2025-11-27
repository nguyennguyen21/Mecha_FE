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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <i className="fas fa-at text-blue-400 text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Username</h3>
          <p className="text-gray-400 text-sm">Typography and styling for username</p>
        </div>
      </div>
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