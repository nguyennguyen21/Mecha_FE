import React from 'react';
// Import từ local types thay vì global types
import { type ProfileData, type UserStyle } from '../types/profile';
import { createAvatarStyle } from '../utils/styleUtils';
import { apiService } from '../services/api';

interface ProfileAvatarProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile, parsedStyles }) => {
  if (!profile.profileAvatar) return null;

  const avatarStyle = createAvatarStyle(parsedStyles, profile);

  return (
    <img
      src={apiService.getAssetUrl(profile.profileAvatar)}
      alt="Avatar"
      style={avatarStyle}
    />
  );
};

export default ProfileAvatar;