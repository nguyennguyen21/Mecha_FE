import React from "react";
import { useParams } from "react-router-dom";
// Types

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
import { createContainerStyle, subContainer } from "./utils/styleUtils";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  // Custom hooks
  const { profile, loading, error } = useProfileData(username);
  const { style, parsedStyles } = useUserStyle(profile?.userId);

  // Apply custom cursor
  useCustomCursor(style);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  const containerStyle = createContainerStyle(parsedStyles);
  const Scontainer = subContainer(parsedStyles, profile);

  return (
    <div 
      style={{
        backgroundImage: "url('/path/to/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={containerStyle}>
        <ProfileBackground profile={profile} />
        <div style={Scontainer}>
          <ProfileAvatar profile={profile} parsedStyles={parsedStyles} />
          <ProfileUsername profile={profile} parsedStyles={parsedStyles} />
          
          {profile.description && <p>{profile.description}</p>}
          
          <ProfileLocation profile={profile} parsedStyles={parsedStyles} />
          <AudioPlayer profile={profile} parsedStyles={parsedStyles} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
