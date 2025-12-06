import React, { useState, useMemo } from "react";
import InformationProfile from "./Components/InformationProfile";
import AudioProfile from "./Components/AudioProfile";
import AdvancedStyleSettings from "./Components/AdvancedStyleSettings";
import LayoutManager from "./Components/LayoutManager"; 
import SubmitButton from "./Components/SubmitButtonProps";
import { useUserStyles } from "./Components/useUserStyles";
import { useProfileData } from "./hooks/useProfileData";
import { useFileUpload } from "./hooks/useFileUpload";
import { useProfileStyles } from "./hooks/useProfileStyles";
import { useProfileSubmit } from "./hooks/useProfileSubmit";
import Toast from "./Components/Toast";
import SocialEditor from "../SocialLinks/Components/SocialEditor";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

// Hook helper để map tất cả các margin từ customStyles
const useApplyMargins = (customStyles: any) => {
  return useMemo(() => {
    const styleMap: Record<string, React.CSSProperties> = {};
    Object.keys(customStyles).forEach(key => {
      if (key.includes("Margin")) {
        styleMap[key] = { margin: customStyles[key] };
      }
    });
    return styleMap;
  }, [customStyles]);
};

const ProfileForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Custom hooks
  const {
    formData,
    setFormData,
    oldFiles,
    setOldFiles,
    uploadingFiles,
    setUploadingFiles,
    isProfileLoading,
    userId,
    getMediaUrl,
    handleChange,
    refetchProfile,
  } = useProfileData();

  const {
    customStyles,
    setCustomStyles,
    handleStyleChange,
  } = useProfileStyles();

  const { loading: stylesLoading, updateUserStyles } =
    useUserStyles();

  const { handleFileChange } = useFileUpload(
    oldFiles,
    setFormData,
    setOldFiles,
    setUploadingFiles,
    setMessage
  );

  const { handleSubmit } = useProfileSubmit(
    formData,
    userId,
    customStyles,
    uploadingFiles,
    updateUserStyles,
    setLoading,
    setMessage,
    refetchProfile
  );

  const marginStyles = useApplyMargins(customStyles);

  const handleApplyLayout = async (layoutData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/UserStyles/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layoutData),
      });
      if (!response.ok) throw new Error('Failed to apply layout');
      
      // Merge styles đúng cách - đảm bảo tất cả các thuộc tính layout được cập nhật
      const updatedStyles = { ...customStyles, ...layoutData.styles };
      setCustomStyles(updatedStyles);
      
      setMessage("Layout applied successfully! Please refresh the profile page to see changes.");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage("Failed to apply layout. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Information'},
    { id: 'styles', label: 'Style Settings'},
    { id: 'layout', label: 'Layout Manager'},
    { id: 'social', label: 'Social Links'},
  ];

  return (
    <div className="flex items-center justify-center min-h-screen text-white transition-all duration-500 w-full">
      <div className="w-full max-w-6xl rounded-xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 backdrop-blur-sm rounded-xl p-1.5 sm:p-2 mb-4 sm:mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg
                transition-all duration-200 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap min-w-fit
                ${activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }
              `}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div style={marginStyles.usernameMargin}>
              <InformationProfile
                formData={formData}
                uploadingFiles={uploadingFiles}
                getMediaUrl={getMediaUrl}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
              />
            </div>
            
            <div className="mx-0 sm:mx-4 md:mx-8" style={marginStyles.descriptionMargin}>
              <AudioProfile
                formData={formData}
                uploadingFiles={uploadingFiles}
                getMediaUrl={getMediaUrl}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <SocialEditor userId={userId ? userId.toString() : ""} />
        )}

        {activeTab === 'styles' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <AdvancedStyleSettings
              customStyles={customStyles}
              handleStyleChange={handleStyleChange}
              stylesLoading={stylesLoading}
              userId={userId!}
            />
          </div>
        )}

        {activeTab === 'layout' && (
          <LayoutManager
            customStyles={customStyles}
            setCustomStyles={setCustomStyles}
            userId={userId!}
            onApplyLayout={handleApplyLayout}
          />
        )}

        <div className="mt-4 sm:mt-6 md:mt-8">
          <SubmitButton
            loading={loading}
            stylesLoading={stylesLoading}
            uploadingFiles={uploadingFiles}
            onSubmit={handleSubmit}
          />
        </div>

        <Toast message={message} />
      </div>
    </div>
  );
};

export default ProfileForm;
