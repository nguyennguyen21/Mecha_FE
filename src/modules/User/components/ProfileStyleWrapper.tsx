// ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type ProfileData = {
  userId: number;
  styleId?: number;
  profileAvatar?: string;
  background?: string;
  audio?: string;
  audioImage?: string;
  audioTitle?: string;
  customCursor?: string;
  description?: string;
  username: string;
  effectUsername?: string;
  location?: string;
};

interface UserStyle {
  [key: string]: any;
  profileBorderStyle?: string;
  profileBorderWidth?: string;
  profileBorderColor?: string;
  profileBorderRadius?: string;
  profilePadding?: string;
  profileBackgroundColor?: string;
  profileOpacity?: number;
  profileBoxShadow?: string;
  avatarBorderRadius?: string;
  avatarShowBorder?: boolean;
  avatarBorderStyle?: string;
  avatarBorderWidth?: string;
  avatarBorderColor?: string;
  usernameFontSize?: string;
  usernameFontStyle?: string;
  usernameFontWeight?: string;
  usernameColor?: string;
  usernameTextShadow?: string;
  usernameTextTransform?: string;
  usernameLetterSpacing?: string;
  locationFontSize?: string;
  locationColor?: string;
  locationFontStyle?: string;
  cursorWidth?: string;
  cursorHeight?: string;
  cursorType?: string;
  cursorColor?: string;
  cursorFontSize?: string;
  cursorFontWeight?: string;
  audioTitleFontSize?: string;
  audioTitleFontWeight?: string;
  audioTitleColor?: string;
  audioTitleLetterSpacing?: string;
  coverImageWidth?: string;
  coverImageHeight?: string;
  coverImageBorderRadius?: string;
  coverImageObjectFit?: string;
  coverImageBorderStyle?: string;
  coverImageBorderWidth?: string;
  coverImageBorderColor?: string;
  coverImageBoxShadow?: string;
}

const BASE_URL = "http://localhost:5159";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<UserStyle | null>(null);

  // Fetch user styles
  useEffect(() => {
    if (!username) {
      console.log("❌ No username provided");
      return;
    }

    console.log("🔍 Fetching style for username:", username);

    const fetchStyle = async () => {
      try {
        const url = `${BASE_URL}/api/UserStyles/username/${username}`;
        console.log("📡 Making request to:", url);
        
        const res = await fetch(url);
        console.log("📥 Response status:", res.status);
        console.log("📥 Response ok:", res.ok);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log("❌ Error response:", errorText);
          throw new Error(`Failed to fetch style: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ User style data:", data);
        console.log("✅ Data type:", typeof data);
        console.log("✅ Data keys:", Object.keys(data));
        
        setStyle(data); 
      } catch (err) {
        console.error("❌ Fetch style error:", err);
      }
    };

    fetchStyle();
  }, [username]);

  // Log style changes
  useEffect(() => {
    console.log("🎨 Style state changed:", style);
  }, [style]);

  // Fetch profile data
  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/profile/username/${username}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data: ProfileData = await res.json();
        setProfile(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  // Original static styles (not applying user styles)
  const theme = profile.username ? "light" : "light";
  const primaryColor = "#888";

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: theme === "light" ? "#fff" : "#222",
    color: theme === "light" ? "#000" : "#fff",
    border: `2px solid ${primaryColor}`,
    padding: "20px",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    overflow: "hidden",
  };

  const backgroundStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
    opacity: 0.3,
  };

  const avatarStyle: React.CSSProperties = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: `4px solid ${primaryColor}`,
    objectFit: "cover",
    boxShadow: profile.effectUsername === "glow" ? `0 0 15px ${primaryColor}` : "none",
  };

  const usernameStyle: React.CSSProperties = {
    color: primaryColor,
    textShadow: profile.effectUsername === "glow" ? `0 0 10px ${primaryColor}` : "none",
    fontSize: "clamp(20px, 5vw, 32px)",
    fontWeight: 700,
    margin: "10px 0",
  };

  const locationStyle: React.CSSProperties = {
    fontSize: "clamp(12px, 2.5vw, 18px)",
    color: theme === "light" ? "#555" : "#ccc",
    fontStyle: "italic",
    marginBottom: "10px",
  };

  const audioContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "15px",
  };

  const audioImageStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    borderRadius: "5px",
    objectFit: "cover",
  };

  return (
    <div style={containerStyle}>

      {/* Background image */}
      {profile.background && (
        <img
          src={`${BASE_URL}${profile.background}`}
          alt="Background"
          style={backgroundStyle}
        />
      )}

      {/* Profile avatar */}
      {profile.profileAvatar && (
        <img
          src={`${BASE_URL}${profile.profileAvatar}`}
          alt="Avatar"
          style={avatarStyle}
        />
      )}

      {/* Username */}
      <h1 style={usernameStyle}>{profile.username}</h1>

      {/* Description */}
      {profile.description && <p>{profile.description}</p>}

      {/* Location */}
      {profile.location && (
        <p style={locationStyle}>Location: {profile.location}</p>
      )}

      {/* Custom cursor info */}
      {profile.customCursor && <p>Cursor: {profile.customCursor}</p>}

      {/* Audio player with image and title */}
      {profile.audio && (
        <div style={audioContainerStyle}>
          {profile.audioImage && (
            <img
              src={`${BASE_URL}${profile.audioImage}`}
              alt="Audio"
              style={audioImageStyle}
            />
          )}
          <div>
            {profile.audioTitle && <p>{profile.audioTitle}</p>}
            <audio src={`${BASE_URL}${profile.audio}`} autoPlay controls />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;