import React, { useEffect, useState } from "react";
import "rc-slider/assets/index.css";
import StylePreview from "./StylePreview";
import ProfileContainerSection from "./sections/ProfileContainerSection";
import AvatarSection from "./sections/AvatarSection";
import UsernameSection from "./sections/UsernameSection";
import LocationSection from "./sections/LocationSection";
import CursorSection from "./sections/CursorSection";
import AudioTitleSection from "./sections/AudioTitleSection";
import CoverImageSection from "./sections/CoverImageSection";
import { type AdvancedStyleSettingsProps } from "../../../types";
import { fetchUserStyles, getDefaultStyles } from "../services/styleService";

const AdvancedStyleSettings: React.FC<AdvancedStyleSettingsProps> = ({
  customStyles,
  handleStyleChange,
  stylesLoading,
  userId
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user styles khi component mount
  useEffect(() => {
    const loadUserStyles = async () => {
      if (userId && !isInitialized) {
        try {
          const userStyles = await fetchUserStyles(userId);
          // Merge với default styles để đảm bảo có đầy đủ properties
          const mergedStyles = { ...getDefaultStyles(), ...userStyles };
          
          // Apply styles to customStyles
          Object.entries(mergedStyles).forEach(([key, value]) => {
            handleStyleChange(key, value);
          });
          
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to load user styles:', error);
          setIsInitialized(true);
        }
      }
    };

    loadUserStyles();
  }, [userId, handleStyleChange, isInitialized]);

  return (
    <div className="mt-8 mx-4 sm:mx-8">
      <div className="bg-gray-900/60 rounded-2xl p-6 border border-purple-500/30 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3">
          🎨 Advanced Style Settings {stylesLoading && "(Loading...)"}
        </h2>

        <ProfileContainerSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />

        <AvatarSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />

        <UsernameSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />

        <LocationSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />

        <CursorSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />

        <AudioTitleSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />

        <CoverImageSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />

        {/* Style Preview */}
        <StylePreview customStyles={customStyles} />
      </div>
    </div>
  );
};

export default AdvancedStyleSettings;