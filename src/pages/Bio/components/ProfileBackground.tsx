// components/ProfileBackground.tsx
import React from 'react';
import { type ProfileData } from '../../../types';
import { apiService } from '../services/api';

interface ProfileBackgroundProps {
  profile: ProfileData;
}

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({ profile }) => {
  if (!profile.background) return null;

  const backgroundStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
    opacity: 0.3,
  };

  return (
    <img
      src={apiService.getAssetUrl(profile.background)}
      alt="Background"
      style={backgroundStyle}
    />
  );
};

export default ProfileBackground;