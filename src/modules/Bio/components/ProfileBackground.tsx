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
  backgroundImage: `url(${apiService.getAssetUrl(profile.background)})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: -1,
};

 return <div style={backgroundStyle}></div>;
};

export default ProfileBackground;