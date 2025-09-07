import React from "react";
import { type CustomStyles } from "../../../types";

interface StylePreviewProps {
  customStyles: CustomStyles;
}

const StylePreview: React.FC<StylePreviewProps> = ({ customStyles }) => {
  // Hàm tạo preview style object
  const getPreviewStyles = () => {
    return {
      border: `${customStyles.profileBorderWidth} ${customStyles.profileBorderStyle} ${customStyles.profileBorderColor}`,
      borderRadius: customStyles.profileBorderRadius,
      padding: customStyles.profilePadding,
      backgroundColor: customStyles.profileBackgroundColor,
      opacity: customStyles.profileOpacity,
      boxShadow: customStyles.profileBoxShadow,
    };
  };

  const getAvatarPreviewStyles = () => {
    return {
      borderRadius: customStyles.avatarBorderRadius,
      border: customStyles.avatarShowBorder 
        ? `${customStyles.avatarBorderWidth} ${customStyles.avatarBorderStyle} ${customStyles.avatarBorderColor}`
        : 'none',
    };
  };

  const getUsernamePreviewStyles = () => {
    return {
      fontSize: customStyles.usernameFontSize,
      fontStyle: customStyles.usernameFontStyle,
      fontWeight: customStyles.usernameFontWeight,
      color: customStyles.usernameColor,
      textShadow: customStyles.usernameTextShadow,
      textTransform: customStyles.usernameTextTransform as any,
      letterSpacing: customStyles.usernameLetterSpacing,
    };
  };

  const getLocationPreviewStyles = () => {
    return {
      fontSize: customStyles.locationFontSize,
      color: customStyles.locationColor,
      fontStyle: customStyles.locationFontStyle,
    };
  };

  const getAudioTitlePreviewStyles = () => {
    return {
      fontSize: customStyles.audioTitleFontSize,
      fontWeight: customStyles.audioTitleFontWeight,
      color: customStyles.audioTitleColor,
      letterSpacing: customStyles.audioTitleLetterSpacing,
    };
  };

  const getCoverImagePreviewStyles = () => {
    return {
      width: customStyles.coverImageWidth,
      height: customStyles.coverImageHeight,
      borderRadius: customStyles.coverImageBorderRadius,
      border: `${customStyles.coverImageBorderWidth} ${customStyles.coverImageBorderStyle} ${customStyles.coverImageBorderColor}`,
      objectFit: customStyles.coverImageObjectFit as any,
      boxShadow: customStyles.coverImageBoxShadow,
    };
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-orange-300 border-b border-orange-500/30 pb-2">
        Preview
      </h3>
      
      {/* Preview Container */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <div style={getPreviewStyles()} className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar Preview */}
            <div 
              className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl"
              style={getAvatarPreviewStyles()}
            >
              U
            </div>
            
            <div>
              {/* Username Preview */}
              <div style={getUsernamePreviewStyles()}>
                Sample Username
              </div>
              {/* Location Preview */}
              <div style={getLocationPreviewStyles()}>
                📍 Ho Chi Minh City
              </div>
            </div>
          </div>
          
          {/* Audio Section Preview */}
          <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
            {/* Cover Image Preview */}
            <div 
              className="bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold"
              style={getCoverImagePreviewStyles()}
            >
              🎵
            </div>
            
            <div>
              {/* Audio Title Preview */}
              <div style={getAudioTitlePreviewStyles()}>
                Sample Audio Title
              </div>
              <div className="text-gray-400 text-sm">Artist Name</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylePreview;