import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import { FONT_STYLE_OPTIONS } from "../../constants/styleOptions";

interface LocationSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
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
          options={FONT_STYLE_OPTIONS}
        />
      </div>
    </div>
  );
};

export default LocationSection;