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
  const { cursorType, cursorWidth, cursorHeight, cursorColor, cursorGlow } = customStyles;

  const width = parseInt(cursorWidth?.replace("px", "") || "16");
  const height = parseInt(cursorHeight?.replace("px", "") || "16");

  // preview style cho cursor custom
  const previewStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: cursorColor || "#ffffff",
    boxShadow: cursorGlow || "none",
    borderRadius: cursorType === "circle" ? "50%" : "4px"
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-indigo-500/30 pb-2">
        🖱️ Custom Cursor
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cursor Width */}
        <StyleInputGroup
          label="Width"
          value={width}
          onChange={(value) => handleStyleChange("cursorWidth", `${value}px`)}
          type="slider"
          min={8}
          max={64}
          step={1}
        />

        {/* Cursor Height */}
        <StyleInputGroup
          label="Height"
          value={height}
          onChange={(value) => handleStyleChange("cursorHeight", `${value}px`)}
          type="slider"
          min={8}
          max={64}
          step={1}
        />

        {/* Cursor Color */}
        <StyleInputGroup
          label="Color"
          value={cursorColor || "#ffffff"}
          onChange={(value) => handleStyleChange("cursorColor", value)}
          type="color"
        />

        {/* Cursor Glow */}
        <StyleInputGroup
          label="Glow Effect"
          value={cursorGlow || ""}
          onChange={(value) => handleStyleChange("cursorGlow", value)}
          type="text"
          placeholder="e.g. 0 0 14px #ffdd88, 0 0 26px #ffeeaa"
        />
      </div>

      {/* Preview box */}
      <div className="mt-6">
        <p className="text-gray-400 text-sm mb-2">Preview:</p>
        <div className="w-20 h-20 flex items-center justify-center bg-gray-800 rounded-lg">
          <div style={previewStyle}></div>
        </div>
      </div>
    </div>
  );
};

export default CursorSection;
