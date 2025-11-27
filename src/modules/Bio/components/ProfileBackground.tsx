// components/ProfileBackground.tsx
import React from 'react';
import { type ProfileData } from '../../../types';
import { apiService } from '../services/api';

interface ProfileBackgroundProps {
  profile: ProfileData;
}

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({ profile }) => {
  if (!profile.background) return null;

  const backgroundUrl = apiService.getAssetUrl(profile.background);
  
  // Check if it's a video file
  const isVideo = /\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(profile.background);

  if (isVideo) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={backgroundUrl} type="video/mp4" />
        {/* Fallback to image if video fails */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%", 
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
          }}
        />
      </video>
    );
  }

  // For image backgrounds
  const backgroundStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%", 
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 0,
    borderRadius: "8px",
    overflow: "hidden",
  };

  return <div style={backgroundStyle}></div>;
};

export default ProfileBackground;