import React from 'react';
import { type ProfileData, type UserStyle } from '../types/profile';
import { createUsernameStyle } from '../utils/styleUtils';

interface ProfileUsernameProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const SubContainer: React.FC<ProfileUsernameProps> = ({ profile, parsedStyles }) => {
  const subContainerStyle = createUsernameStyle(parsedStyles, profile);

  return (
    <div style={subContainerStyle}>
    </div>
  );
};

export default SubContainer;