// components/AudioPlayer.tsx
import React from 'react';
import { type ProfileData, type UserStyle } from '../types/profile';
import { apiService } from '../services/api';

interface AudioPlayerProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ profile, parsedStyles }) => {
  if (!profile.audio) return null;

  const audioContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "15px",
  };

  // Define styles inline since they're specific to this component
  const audioImageStyle: React.CSSProperties = {
    width: parsedStyles?.coverImageWidth || "60px",
    height: parsedStyles?.coverImageHeight || "60px",
    borderRadius: parsedStyles?.coverImageBorderRadius || "5px",
    objectFit: (parsedStyles?.coverImageObjectFit as any) || "cover",
    border: parsedStyles?.coverImageBorderStyle && parsedStyles?.coverImageBorderWidth && parsedStyles?.coverImageBorderColor
      ? `${parsedStyles.coverImageBorderWidth} ${parsedStyles.coverImageBorderStyle} ${parsedStyles.coverImageBorderColor}`
      : "none",
    boxShadow: parsedStyles?.coverImageBoxShadow || "none",
  };

  const audioTitleStyle: React.CSSProperties = {
    fontSize: parsedStyles?.audioTitleFontSize || "16px",
    fontWeight: parsedStyles?.audioTitleFontWeight || "normal",
    color: parsedStyles?.audioTitleColor || "#000",
    letterSpacing: parsedStyles?.audioTitleLetterSpacing || "normal",
    margin: 0,
  };

  return (
    <div style={audioContainerStyle}>
      {profile.audioImage && (
        <img
          src={apiService.getAssetUrl(profile.audioImage)}
          alt="Audio"
          style={audioImageStyle}
        />
      )}
      <div>
        {profile.audioTitle && (
          <p style={audioTitleStyle}>{profile.audioTitle}</p>
        )}
        <audio 
          src={apiService.getAssetUrl(profile.audio)} 
          autoPlay 
          controls 
        />
      </div>
    </div>
  );
};

export default AudioPlayer;