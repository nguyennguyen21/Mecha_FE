// components/ProfileLocation.tsx
import React from 'react';
// Import từ local types thay vì global types
import { type ProfileData, type UserStyle } from '../types/profile';
import { createLocationStyle } from '../utils/styleUtils';

interface ProfileLocationProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const ProfileLocation: React.FC<ProfileLocationProps> = ({ profile, parsedStyles }) => {
  if (!profile.location) return null;

  const locationStyle = createLocationStyle(parsedStyles);

  return (
    <p style={locationStyle} className="flex items-center gap-2">
      <i className="fas fa-map-marker-alt"></i>
      <span>Location: {profile.location}</span>
    </p>
  );
};

export default ProfileLocation;