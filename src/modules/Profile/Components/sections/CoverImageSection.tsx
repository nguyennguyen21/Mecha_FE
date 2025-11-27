import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import {
  BASIC_BORDER_STYLE_OPTIONS,
  OBJECT_FIT_OPTIONS
} from "../../constants/styleOptions";

interface CoverImageSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const CoverImageSection: React.FC<CoverImageSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <i className="fas fa-image text-cyan-400 text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Cover Image</h3>
          <p className="text-gray-400 text-sm">Style the audio cover image</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StyleInputGroup
          label="Width"
          value={parseInt(customStyles.coverImageWidth?.replace("px", "") || "45")}
          onChange={(value) => handleStyleChange("coverImageWidth", `${value}px`)}
          type="slider"
          min={30}
          max={200}
          step={5}
        />
        <StyleInputGroup
          label="Height"
          value={parseInt(customStyles.coverImageHeight?.replace("px", "") || "45")}
          onChange={(value) => handleStyleChange("coverImageHeight", `${value}px`)}
          type="slider"
          min={30}
          max={200}
          step={5}
        />
        <StyleInputGroup
          label="Border Radius"
          value={parseInt(customStyles.coverImageBorderRadius?.replace("px", "") || "8")}
          onChange={(value) => handleStyleChange("coverImageBorderRadius", `${value}px`)}
          type="slider"
          min={0}
          max={50}
          step={1}
        />
        <StyleInputGroup
          label="Border Width"
          value={parseInt(customStyles.coverImageBorderWidth?.replace("px", "") || "0")}
          onChange={(value) => handleStyleChange("coverImageBorderWidth", `${value}px`)}
          type="slider"
          min={0}
          max={10}
          step={1}
        />
        <StyleInputGroup
          label="Border Style"
          value={customStyles.coverImageBorderStyle || "solid"}
          onChange={(value) => handleStyleChange("coverImageBorderStyle", value)}
          type="select"
          options={BASIC_BORDER_STYLE_OPTIONS}
        />
        <StyleInputGroup
          label="Border Color"
          value={customStyles.coverImageBorderColor || "#ffffff"}
          onChange={(value) => handleStyleChange("coverImageBorderColor", value)}
          type="color"
        />
        <StyleInputGroup
          label="Object Fit"
          value={customStyles.coverImageObjectFit || "cover"}
          onChange={(value) => handleStyleChange("coverImageObjectFit", value)}
          type="select"
          options={OBJECT_FIT_OPTIONS}
        />
        <StyleInputGroup
          label="Box Shadow"
          value={customStyles.coverImageBoxShadow || "0 10px 15px -3px rgba(0, 0, 0, 0.1)"}
          onChange={(value) => handleStyleChange("coverImageBoxShadow", value)}
          type="text"
          placeholder="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        />
      </div>
    </div>
  );
};

export default CoverImageSection;