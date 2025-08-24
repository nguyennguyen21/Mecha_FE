import React from "react";

interface SubmitButtonProps {
  loading: boolean;
  stylesLoading: boolean;
  uploadingFiles: {
    profileAvatar: boolean;
    background: boolean;
    audio: boolean;
    audioImage: boolean;
  };
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  stylesLoading,
  uploadingFiles,
  onSubmit,
}) => {
  const isDisabled = loading || stylesLoading || Object.values(uploadingFiles).some(Boolean);

  const getButtonContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Updating Profile...
        </div>
      );
    }

    if (Object.values(uploadingFiles).some(Boolean)) {
      return (
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Uploading Files...
        </div>
      );
    }

    if (stylesLoading) {
      return (
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Loading Styles...
        </div>
      );
    }

    return "🚀 Update Profile & Styles";
  };

  return (
    <div className="mt-8 mx-4 sm:mx-8 pb-8 pt-6 border-t border-gray-700/20">
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        {getButtonContent()}
      </button>
    </div>
  );
};

export default SubmitButton;