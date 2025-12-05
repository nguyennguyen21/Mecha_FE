import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";
import { BASIC_BORDER_STYLE_OPTIONS, AVATAR_SHAPE_OPTIONS } from "../../constants/styleOptions";

interface AvatarSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <i className="fas fa-user-circle text-green-400 text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Avatar</h3>
          <p className="text-gray-400 text-sm">Style your profile picture</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StyleInputGroup
          label="Shape"
          value={customStyles.avatarBorderRadius === "50%" ? "circle" : "square"}
          onChange={(value) =>
            handleStyleChange("avatarBorderRadius", value === "circle" ? "50%" : "8px")
          }
          type="select"
          options={AVATAR_SHAPE_OPTIONS}
        />
        <StyleInputGroup
          label="Off/On Border"
          value={customStyles.avatarShowBorder ?? false}
          onChange={(value) => handleStyleChange("avatarShowBorder", value)}
          type="checkbox"
        />
        <StyleInputGroup
          label="Border Width"
          value={parseInt(customStyles.avatarBorderWidth?.replace("px", "") || "0")}
          onChange={(value) => handleStyleChange("avatarBorderWidth", `${value}px`)}
          type="slider"
          min={0}
          max={10}
          step={1}
          disabled={!customStyles.avatarShowBorder}
        />
        <StyleInputGroup
          label="Border Style"
          value={customStyles.avatarBorderStyle || "solid"}
          onChange={(value) => handleStyleChange("avatarBorderStyle", value)}
          type="select"
          options={BASIC_BORDER_STYLE_OPTIONS}
          disabled={!customStyles.avatarShowBorder}
        />
        <StyleInputGroup
          label="Border Color"
          value={customStyles.avatarBorderColor || "#ffffff"}
          onChange={(value) => handleStyleChange("avatarBorderColor", value)}
          type="color"
          disabled={!customStyles.avatarShowBorder}
        />
      </div>
    </div>
  );
};

export default AvatarSection;