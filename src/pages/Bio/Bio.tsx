// ProfilePage.tsx (Fixed)
import React from "react";
import { useParams } from "react-router-dom";

// Types
import { type UserStyle } from "./types/profile";

// Components
import ProfileBackground from "./components/ProfileBackground";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileUsername from "./components/ProfileUsername";
import ProfileLocation from "./components/ProfileLocation";
import AudioPlayer from "./components/AudioPlayer";

// Hooks
import { useProfileData } from "./hooks/useProfileData";
import { useUserStyle } from "./hooks/useUserStyle";
import { useCustomCursor } from "./hooks/useCustomCursor";

// Utils
import { createContainerStyle } from "./utils/styleUtils";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  // Custom hooks
  const { profile, loading, error } = useProfileData(username);
  const { style, parsedStyles } = useUserStyle(profile?.userId);
  useCustomCursor(style);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  const containerStyle = createContainerStyle(parsedStyles);

  return (
    <div style={containerStyle}>
      <ProfileBackground profile={profile} />
      
      {/* No more type casting needed */}
      <ProfileAvatar profile={profile} parsedStyles={parsedStyles} />
      
      <ProfileUsername profile={profile} parsedStyles={parsedStyles} />

      {/* Description */}
      {profile.description && <p>{profile.description}</p>}

      <ProfileLocation profile={profile} parsedStyles={parsedStyles} />

      {/* Custom cursor info */}
      {profile.customCursor && <p>Cursor: {profile.customCursor}</p>}

      <AudioPlayer profile={profile} parsedStyles={parsedStyles} />
    </div>
  );
};

export default ProfilePage;