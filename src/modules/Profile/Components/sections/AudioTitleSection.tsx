import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import { FONT_WEIGHT_OPTIONS } from "../../constants/styleOptions";

interface AudioTitleSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const AudioTitleSection: React.FC<AudioTitleSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-pink-300 border-b border-pink-500/30 pb-2">
        Audio Title
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
  );
};

export default AudioTitleSection;