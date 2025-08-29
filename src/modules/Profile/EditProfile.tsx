import React, { useState, useEffect } from "react";
import InformationProfile from "./Components/InformationProfile";
import AudioProfile from "./Components/AudioProfile";
import AdvancedStyleSettings from "./Components/AdvancedStyleSettings";
import QuickStylePresets from "./Components/QuickStylePresets";
import MessageHandler from "./Components/MessageHandler";
import SubmitButton from "./Components/SubmitButtonProps";
import { useUserStyles } from "./Components/useUserStyles";
import { useProfileData } from "./hooks/useProfileData";
import { useFileUpload } from "./hooks/useFileUpload";
import { useProfileStyles } from "./hooks/useProfileStyles";
import { useProfileSubmit } from "./hooks/useProfileSubmit";

const ProfileForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
  } = useProfileData();

  const {
    customStyles,
    setCustomStyles,
    handleStyleChange,
  } = useProfileStyles();

  const { loading: stylesLoading, error: stylesError, updateUserStyles } = useUserStyles();

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
    setMessage
  );

  // Debug logs
  useEffect(() => {
    console.log("🔄 formData changed:", {
      audio: formData.audio,
      audioImage: formData.audioImage,
      audioTitle: formData.audioTitle,
    });
  }, [formData.audio, formData.audioImage, formData.audioTitle]);

  useEffect(() => {
    console.log("📁 oldFiles changed:", oldFiles);
  }, [oldFiles]);

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white transition-all duration-500">
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl p-6">
        <MessageHandler message={message} stylesError={stylesError} />

        <InformationProfile
          formData={formData}
          uploadingFiles={uploadingFiles}
          getMediaUrl={getMediaUrl}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />

        <div className="mt-8 mx-4 sm:mx-8">
          <AudioProfile
            formData={formData}
            uploadingFiles={uploadingFiles}
            getMediaUrl={getMediaUrl}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
        </div>

        <AdvancedStyleSettings
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
          stylesLoading={stylesLoading}
          userId={userId!}
        />

        <QuickStylePresets
          customStyles={customStyles}
          setCustomStyles={setCustomStyles}
          userId={userId}
          setMessage={setMessage}
          setFormData={setFormData}
        />

        <SubmitButton
          loading={loading}
          stylesLoading={stylesLoading}
          uploadingFiles={uploadingFiles}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ProfileForm;