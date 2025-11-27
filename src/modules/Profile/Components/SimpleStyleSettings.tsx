import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import StylePreview from "./StylePreview";
import { type AdvancedStyleSettingsProps } from "../../../types";
import { fetchUserStyles, getDefaultStyles } from "../services/styleService";
import MarginEditor from "./MarginEditor";
import ProfileContainerSection from "./sections/ProfileContainerSection";
import AvatarSection from "./sections/AvatarSection";
import UsernameSection from "./sections/UsernameSection";
import LocationSection from "./sections/LocationSection";
import CursorSection from "./sections/CursorSection";
import AudioTitleSection from "./sections/AudioTitleSection";
import CoverImageSection from "./sections/CoverImageSection";
import DescriptionSection from "./sections/DescriptionSection";

interface StyleCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const SimpleStyleSettings: React.FC<AdvancedStyleSettingsProps> = ({
  customStyles,
  handleStyleChange,
  stylesLoading,
  userId
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("preview");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load user styles khi component mount
  useEffect(() => {
    const loadUserStyles = async () => {
      if (userId && !isInitialized) {
        try {
          const userStyles = await fetchUserStyles(userId);
          const mergedStyles = { ...getDefaultStyles(), ...userStyles };
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

  const categories: StyleCategory[] = [
    {
      id: "preview",
      name: "Preview",
      icon: <i className="fas fa-eye text-blue-400"></i>,
      component: (
        <StylePreview 
          customStyles={customStyles} 
          onOrderChange={(newOrder) => {
            Object.entries(newOrder).forEach(([key, value]) => {
              handleStyleChange(`${key}Order`, value);
            });
          }}
        />
      )
    },
    {
      id: "container",
      name: "Container",
      icon: <i className="fas fa-square text-purple-400"></i>,
      component: (
        <ProfileContainerSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />
      )
    },
    {
      id: "avatar",
      name: "Avatar",
      icon: <i className="fas fa-user-circle text-green-400"></i>,
      component: (
        <AvatarSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />
      )
    },
    {
      id: "text",
      name: "Text & Typography",
      icon: <i className="fas fa-font text-blue-400"></i>,
      component: (
        <>
          <UsernameSection 
            customStyles={customStyles}
            handleStyleChange={handleStyleChange}
          />
          <DescriptionSection 
            customStyles={customStyles}
            handleStyleChange={handleStyleChange}
          />
          <LocationSection 
            customStyles={customStyles}
            handleStyleChange={handleStyleChange}
          />
        </>
      )
    },
    {
      id: "media",
      name: "Media",
      icon: <i className="fas fa-image text-pink-400"></i>,
      component: (
        <>
          <AudioTitleSection 
            customStyles={customStyles}
            handleStyleChange={handleStyleChange}
          />
          <CoverImageSection 
            customStyles={customStyles}
            handleStyleChange={handleStyleChange}
          />
        </>
      )
    },
    {
      id: "spacing",
      name: "Spacing",
      icon: <i className="fas fa-arrows-alt text-yellow-400"></i>,
      component: (
        <MarginEditor
          customStyles={customStyles}
          onChange={handleStyleChange}
        />
      )
    },
    {
      id: "cursor",
      name: "Cursor",
      icon: <i className="fas fa-mouse-pointer text-red-400"></i>,
      component: (
        <CursorSection 
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
        />
      )
    }
  ];

  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  return (
    <div className="mt-8 mx-4 sm:mx-8">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600/20 border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
                <i className="fas fa-palette text-purple-400"></i>
                Style Settings
              </h2>
              <p className="text-gray-400 text-sm">Customize your profile appearance</p>
            </div>
            {stylesLoading && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-700/50 bg-gray-800/30">
          <div className="flex overflow-x-auto scrollbar-hide px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                  border-b-2 border-transparent
                  ${activeCategory === category.id
                    ? 'text-purple-400 border-purple-400 bg-purple-400/10'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                  }
                `}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeCategoryData && (
            <div className="fade-in">
              {activeCategoryData.component}
            </div>
          )}
        </div>

        {/* Advanced Toggle */}
        <div className="border-t border-gray-700/50 bg-gray-800/20 p-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-gray-400 hover:text-gray-300 transition-colors"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <i className={`fas ${showAdvanced ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              Advanced Options
            </span>
            <span className="text-xs bg-gray-700/50 px-2 py-1 rounded">
              {showAdvanced ? 'Hide' : 'Show'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleStyleSettings;

