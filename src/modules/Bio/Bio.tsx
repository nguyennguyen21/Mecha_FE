import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import ProfileBackground from "./components/ProfileBackground";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileUsername from "./components/ProfileUsername";
import ProfileLocation from "./components/ProfileLocation";
import AudioPlayer from "./components/AudioPlayer";
import Loading from "./components/Loading";
import ProfileDescription from "./components/ProfileDescription";
import SocialLinks from "./components/SocialLinks";

// Hooks
import { useProfileData } from "./hooks/useProfileData";
import { useUserStyle } from "./hooks/useUserStyle";
import { useCustomCursor } from "./hooks/useCustomCursor";

// Utils
import { createContainerStyle, subContainer } from "./utils/styleUtils";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [entered, setEntered] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [elementsVisible, setElementsVisible] = useState({
    avatar: false,
    username: false,
    description: false,
    socialLinks: false,
    location: false,
    audio: false,
  });

  // Custom hooks
  const { profile, loading, error } = useProfileData(username);
  const { style, parsedStyles } = useUserStyle(profile?.userId);
  useCustomCursor(style);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => setEntered(true), 1000); // trùng với animation
  };

  // Staggered animation for profile elements
  useEffect(() => {
    if (entered && profile) {
      const animationSequence = [
        { key: 'avatar', delay: 200 },
        { key: 'username', delay: 400 },
        { key: 'description', delay: 600 },
        { key: 'socialLinks', delay: 800 },
        { key: 'location', delay: 1000 },
        { key: 'audio', delay: 1200 },
      ];

      animationSequence.forEach(({ key, delay }) => {
        setTimeout(() => {
          setElementsVisible(prev => ({
            ...prev,
            [key]: true,
          }));
        }, delay);
      });
    }
  }, [entered, profile]);

  if (!entered) {
    return (
      <div className="relative min-h-screen font-poppins">
        {/* Background */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-filter duration-1000 ${
            fadeOut ? "blur-0" : "blur-sm"
          }`}
          style={{ background: "black" }}
        />

        {/* Splash overlay */}
        <div
          onClick={handleEnter}
          className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center cursor-pointer transition-all duration-1000 ${
            fadeOut ? "opacity-20 bg-transparent" : "opacity-100 bg-black/70"
          }`}
        >
          {/* Logo */}
          <img
            src="/mecha.png"
            alt="Mecha Logo"
            className={`transition-all duration-1000 ${
              fadeOut ? "w-20 h-20" : "w-36 h-36 animate-pulse"
            } drop-shadow-[0_0_20px_#8b5cf6] mb-5`}
          />

          {/* Title */}
          <h1
            className={`text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent transition-all duration-1000 ${
              fadeOut ? "text-2xl" : ""
            }`}
          >
            Welcome to Mecha
          </h1>

          {/* Click to Enter */}
          <p
            className={`text-white/90 text-xl transition-all duration-1000 ${
              fadeOut ? "text-base" : "text-2xl"
            } drop-shadow-md`}
          >
            Click to Enter
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  const containerStyle = createContainerStyle(parsedStyles);
  const subContainerStyle = subContainer(parsedStyles, profile);

  // Animation style helper
  const getAnimationStyle = (isVisible: boolean) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/path/to/background.jpg')" }}
    >
      <div style={containerStyle}>
        <ProfileBackground profile={profile} />
        <div style={subContainerStyle}>
          <div 
            style={{
              order: parsedStyles.avatarOrder,
              ...getAnimationStyle(elementsVisible.avatar)
            }}
          >
            <ProfileAvatar profile={profile} parsedStyles={parsedStyles} />
          </div>
          
          <div 
            style={{
              order: parsedStyles.usernameOrder,
              ...getAnimationStyle(elementsVisible.username)
            }}
          >
            <ProfileUsername profile={profile} parsedStyles={parsedStyles} />
          </div>
          
          <div 
            style={{
              order: parsedStyles.descriptionOrder,
              ...getAnimationStyle(elementsVisible.description)
            }}
          >
            <ProfileDescription profile={profile} parsedStyles={parsedStyles} />
          </div>
          
          <div 
            style={{
              order: parsedStyles.descriptionOrder + 1,
              marginTop: 10,
              ...getAnimationStyle(elementsVisible.socialLinks)
            }}
          >
            <SocialLinks userId={profile.userId} />
          </div>
          
          <div 
            style={{
              order: parsedStyles.locationOrder,
              ...getAnimationStyle(elementsVisible.location)
            }}
          >
            <ProfileLocation profile={profile} parsedStyles={parsedStyles} />
          </div>
          
          <div 
            style={{
              order: parsedStyles.audioOrder,
              ...getAnimationStyle(elementsVisible.audio)
            }}
          >
            <AudioPlayer profile={profile} parsedStyles={parsedStyles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;