import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfileBackground from "./components/ProfileBackground";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileUsername from "./components/ProfileUsername";
import ProfileLocation from "./components/ProfileLocation";
import AudioPlayer from "./components/AudioPlayer";
import Loading from "./components/Loading";
import ProfileDescription from "./components/ProfileDescription";
import SocialLinks from "./components/SocialLinks";
import { type AudioPlayerRef } from "./components/AudioPlayer";
import { useProfileData } from "./hooks/useProfileData";
import { useUserStyle } from "./hooks/useUserStyle";
import { useCustomCursor } from "./hooks/useCustomCursor";
import { createContainerStyle, subContainer } from "./utils/styleUtils";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [entered, setEntered] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [elementsVisible, setElementsVisible] = useState({
    avatar: false,
    username: false,
    description: false,
    socialLinks: false,
    location: false,
    audio: false,
  });

  const audioRef = useRef<AudioPlayerRef>(null);
  const { profile, loading, error } = useProfileData(username);
  const { parsedStyles } = useUserStyle(profile?.userId, profile?.username ?? "Guest");

  useCustomCursor(parsedStyles);

  useEffect(() => {
    if (profile?.background) {
      const img = new Image();
      img.src = profile.background;
    }
  }, [profile?.background]);

  const handleEnter = () => {
    if (audioRef.current && profile?.audio) {
      audioRef.current.play().catch(console.error);
    }
    setEntered(true);
    setShowProfile(true);
  };

  useEffect(() => {
    if (showProfile && profile) {
      const sequence = [
        { key: "avatar", delay: 0 },
        { key: "username", delay: 200 },
        { key: "description", delay: 400 },
        { key: "socialLinks", delay: 600 },
        { key: "location", delay: 800 },
        { key: "audio", delay: 1000 },
      ];
      sequence.forEach(({ key, delay }) => {
        setTimeout(() => {
          setElementsVisible((prev) => ({ ...prev, [key]: true }));
        }, delay);
      });
    }
  }, [showProfile, profile]);

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <div className="flex justify-center items-center min-h-screen text-white">Error: {error}</div>;
  if (!profile) return <div className="flex justify-center items-center min-h-screen text-white">Profile not found</div>;

  const containerStyle = createContainerStyle(parsedStyles);
  const subContainerStyle = subContainer(parsedStyles, profile);

  const getAnimationStyle = (isVisible: boolean) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0px)" : "translateY(20px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  });

  return (
    <div className="relative min-h-screen font-poppins bg-black">
      {!entered && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-center items-center cursor-pointer bg-black"
          onClick={handleEnter}
        >
          <img
            src="/mecha.png"
            alt="Mecha Logo"
            className="w-36 h-36 animate-pulse opacity-100 scale-100 drop-shadow-[0_0_20px_#8b5cf6] mb-5"
          />
          <h1 className="font-extrabold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-4xl md:text-5xl">
            Welcome to Mecha
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">Click to Enter</p>
        </div>
      )}
      <div
        className="fixed inset-0 flex justify-center items-center"
        style={{
          background: profile?.background
            ? `url(${profile.background}) center/cover no-repeat`
            : "#000",
          opacity: showProfile ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <div style={containerStyle}>
          <ProfileBackground profile={profile} />
          <div style={subContainerStyle}>
            <div style={{ order: parsedStyles?.avatarOrder || 1, ...getAnimationStyle(elementsVisible.avatar) }}>
              <ProfileAvatar profile={profile} parsedStyles={parsedStyles} />
            </div>
            <div style={{ order: parsedStyles?.usernameOrder || 2, ...getAnimationStyle(elementsVisible.username) }}>
              <ProfileUsername profile={profile} parsedStyles={parsedStyles} />
            </div>
            <div style={{ order: parsedStyles?.descriptionOrder || 3, ...getAnimationStyle(elementsVisible.description) }}>
              <ProfileDescription profile={profile} parsedStyles={parsedStyles} />
            </div>
            <div style={{ order: (parsedStyles?.descriptionOrder || 3) + 1, marginTop: 10, ...getAnimationStyle(elementsVisible.socialLinks) }}>
              <SocialLinks userId={profile.userId} />
            </div>
            <div style={{ order: parsedStyles?.locationOrder || 5, ...getAnimationStyle(elementsVisible.location) }}>
              <ProfileLocation profile={profile} parsedStyles={parsedStyles} />
            </div>
            <div style={{ order: parsedStyles?.audioOrder || 6, ...getAnimationStyle(elementsVisible.audio) }}>
              <AudioPlayer ref={audioRef} profile={profile} parsedStyles={parsedStyles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
