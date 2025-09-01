// ProfilePage.tsx (Cleaned)
import React from "react";
import { useParams } from "react-router-dom";

// Components
import BackgroundWrapper from "../Bio/components/BackgroundWrapper";
import ProfileBackground from "./components/ProfileBackground";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileUsername from "./components/ProfileUsername";
import ProfileLocation from "./components/ProfileLocation";
import AudioPlayer from "./components/AudioPlayer";
import Loading from "./components/Loading";
import ProfileDescription from "./components/ProfileDescription"
// Hooks
import { useProfileData } from "./hooks/useProfileData";
import { useUserStyle } from "./hooks/useUserStyle";
import { useCustomCursor } from "./hooks/useCustomCursor";

// Utils
import { createContainerStyle, subContainer } from "./utils/styleUtils";

// Types
import { type UserStyle } from "./types/profile";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  // Custom hooks
  const { profile, loading, error } = useProfileData(username);
  const { style, parsedStyles } = useUserStyle(profile?.userId);
  useCustomCursor(style);

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  const containerStyle = createContainerStyle(parsedStyles);
  const subContainerStyle = subContainer(parsedStyles, profile);

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
       <div style={subContainerStyle}>
  <div style={{ order: parsedStyles.avatarOrder }}>
    <ProfileAvatar profile={profile} parsedStyles={parsedStyles} />
  </div>
  <div style={{ order: parsedStyles.usernameOrder }}>
    <ProfileUsername profile={profile} parsedStyles={parsedStyles} />
  </div>
  <div style={{ order: parsedStyles.descriptionOrder }}>
    <ProfileDescription profile={profile} parsedStyles={parsedStyles} />
  </div>
  <div style={{ order: parsedStyles.locationOrder }}>
    <ProfileLocation profile={profile} parsedStyles={parsedStyles} />
  </div>
  <div style={{ order: parsedStyles.audioOrder }}>
    <AudioPlayer profile={profile} parsedStyles={parsedStyles} />
  </div>
</div>

      </div>
    </div>
  );
};

export default ProfilePage;
