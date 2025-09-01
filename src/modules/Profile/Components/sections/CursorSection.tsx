import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import {
  CURSOR_TYPE_OPTIONS,
  BASIC_FONT_WEIGHT_OPTIONS
} from "../../constants/styleOptions";

interface CursorSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const CursorSection: React.FC<CursorSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
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
  );
};

export default CursorSection;