import React, { useEffect, useState } from "react";
import "rc-slider/assets/index.css";
import ProfileContainerSection from "./sections/ProfileContainerSection";
import AvatarSection from "./sections/AvatarSection";
import UsernameSection from "./sections/UsernameSection";
import LocationSection from "./sections/LocationSection";
import CursorSection from "./sections/CursorSection";
import AudioTitleSection from "./sections/AudioTitleSection";
import CoverImageSection from "./sections/CoverImageSection";
import DescriptionSection from "./sections/DescriptionSection";
import { type AdvancedStyleSettingsProps } from "../../../types";
import { fetchUserStyles, getDefaultStyles } from "../services/styleService";
import MarginEditor from "./MarginEditor";

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

  const [activeCategory, setActiveCategory] = useState<string>("container");

  const categories = [
    { id: "container", name: "Container", icon: <i className="fas fa-square"></i>, activeClass: "text-purple-400 border-purple-400 bg-purple-400/10" },
    { id: "avatar", name: "Avatar", icon: <i className="fas fa-user-circle"></i>, activeClass: "text-green-400 border-green-400 bg-green-400/10" },
    { id: "text", name: "Text", icon: <i className="fas fa-font"></i>, activeClass: "text-blue-400 border-blue-400 bg-blue-400/10" },
    { id: "media", name: "Media", icon: <i className="fas fa-image"></i>, activeClass: "text-pink-400 border-pink-400 bg-pink-400/10" },
    { id: "spacing", name: "Spacing", icon: <i className="fas fa-arrows-alt"></i>, activeClass: "text-yellow-400 border-yellow-400 bg-yellow-400/10" },
    { id: "cursor", name: "Cursor", icon: <i className="fas fa-mouse-pointer"></i>, activeClass: "text-red-400 border-red-400 bg-red-400/10" },
  ];

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case "container":
        return <ProfileContainerSection customStyles={customStyles} handleStyleChange={handleStyleChange} />;
      case "avatar":
        return <AvatarSection customStyles={customStyles} handleStyleChange={handleStyleChange} />;
      case "text":
        return (
          <>
            <UsernameSection customStyles={customStyles} handleStyleChange={handleStyleChange} />
            <DescriptionSection customStyles={customStyles} handleStyleChange={handleStyleChange} />
            <LocationSection customStyles={customStyles} handleStyleChange={handleStyleChange} />
          </>
        );
      case "media":
        return (
          <>
            <AudioTitleSection customStyles={customStyles} handleStyleChange={handleStyleChange} />
            <CoverImageSection customStyles={customStyles} handleStyleChange={handleStyleChange} />
          </>
        );
      case "spacing":
        return <MarginEditor customStyles={customStyles} onChange={handleStyleChange} />;
      case "cursor":
        return <CursorSection customStyles={customStyles} handleStyleChange={handleStyleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-8 mx-4 sm:mx-8">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600/20 border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
                <i className="fas fa-palette text-purple-400"></i>
                Style Customization
              </h2>
              <p className="text-gray-400 text-sm">Fine-tune your profile appearance</p>
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
                  flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap
                  border-b-2 relative
                  ${activeCategory === category.id
                    ? category.activeClass
                    : 'text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-700/30'
                  }
                `}
              >
                <span className={activeCategory === category.id ? '' : 'text-gray-400'}>
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="fade-in">
            {renderCategoryContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStyleSettings;