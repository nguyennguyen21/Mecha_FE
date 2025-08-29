// components/ProfileUsername.tsx
import React from 'react';
import { type ProfileData, type UserStyle } from '../types/profile';
import { createUsernameStyle } from '../utils/styleUtils';

interface ProfileUsernameProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const ProfileUsername: React.FC<ProfileUsernameProps> = ({ profile, parsedStyles }) => {
  const usernameStyle = createUsernameStyle(parsedStyles, profile);

  return (
    <h1 style={usernameStyle}>
      {profile.username}
    </h1>
  );
};

export default ProfileUsername;