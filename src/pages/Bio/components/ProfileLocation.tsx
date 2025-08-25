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
    <p style={locationStyle}>
      Location: {profile.location}
    </p>
  );
};

export default ProfileLocation;