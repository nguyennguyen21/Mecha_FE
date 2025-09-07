import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import {
  FONT_STYLE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  TEXT_TRANSFORM_OPTIONS
} from "../../constants/styleOptions";

interface DescriptionSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-green-300 border-b border-green-500/30 pb-2">
        Description
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StyleInputGroup
          label="Font Size"
          value={parseInt(customStyles.descFontSize?.replace("px", "") || "14")}
          onChange={(value) => handleStyleChange("descFontSize", `${value}px`)}
          type="slider"
          min={12}
          max={36}
          step={1}
        />
        <StyleInputGroup
          label="Font Style"
          value={customStyles.descFontStyle || "normal"}
          onChange={(value) => handleStyleChange("descFontStyle", value)}
          type="select"
          options={FONT_STYLE_OPTIONS}
        />
        <StyleInputGroup
          label="Font Weight"
          value={customStyles.descFontWeight || "400"}
          onChange={(value) => handleStyleChange("descFontWeight", value)}
          type="select"
          options={FONT_WEIGHT_OPTIONS}
        />
        <StyleInputGroup
          label="Color"
          value={customStyles.descColor || "#cccccc"}
          onChange={(value) => handleStyleChange("descColor", value)}
          type="color"
        />
        <StyleInputGroup
          label="Text Shadow"
          value={customStyles.descTextShadow || "0 0 5px rgba(0,0,0,0.3)"}
          onChange={(value) => handleStyleChange("descTextShadow", value)}
          type="text"
          placeholder="0 0 5px rgba(0,0,0,0.3)"
        />
        <StyleInputGroup
          label="Text Transform"
          value={customStyles.descTextTransform || "none"}
          onChange={(value) => handleStyleChange("descTextTransform", value)}
          type="select"
          options={TEXT_TRANSFORM_OPTIONS}
        />
        <StyleInputGroup
          label="Letter Spacing"
          value={parseFloat(customStyles.descLetterSpacing?.replace("px", "") || "0")}
          onChange={(value) => handleStyleChange("descLetterSpacing", `${value}px`)}
          type="slider"
          min={-2}
          max={10}
          step={0.1}
        />
      </div>
    </div>
  );
};

export default DescriptionSection;
