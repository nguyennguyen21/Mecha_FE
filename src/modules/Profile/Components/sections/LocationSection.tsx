import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import { FONT_STYLE_OPTIONS, FONT_WEIGHT_OPTIONS } from "../../constants/styleOptions";

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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-500/20 rounded-lg">
          <i className="fas fa-map-marker-alt text-red-400 text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Location</h3>
          <p className="text-gray-400 text-sm">Customize location display</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Font size */}
        <StyleInputGroup
          label="Font Size"
          value={parseInt(customStyles.locationFontSize?.replace("px", "") || "14")}
          onChange={(value) => handleStyleChange("locationFontSize", `${value}px`)}
          type="slider"
          min={10}
          max={24}
          step={1}
        />

        {/* Font color */}
        <StyleInputGroup
          label="Color"
          value={customStyles.locationColor || "#9ca3af"}
          onChange={(value) => handleStyleChange("locationColor", value)}
          type="color"
        />

        {/* Font style */}
        <StyleInputGroup
          label="Font Style"
          value={customStyles.locationFontStyle || "normal"}
          onChange={(value) => handleStyleChange("locationFontStyle", value)}
          type="select"
          options={FONT_STYLE_OPTIONS}
        />

        {/* Font weight */}
        <StyleInputGroup
          label="Font Weight"
          value={customStyles.locationFontWeight || "400"}
          onChange={(value) => handleStyleChange("locationFontWeight", value)}
          type="select"
          options={FONT_WEIGHT_OPTIONS}
        />
      </div>
    </div>
  );
};

export default LocationSection;
