import React, { useState, useEffect } from "react";
import { type CustomStyles } from "../../types";

interface StylePreviewProps {
  userId: number | null;
  token: string;
}

const API_BASE_URL = "http://localhost:5159";

const StylePreview: React.FC<StylePreviewProps> = ({ userId, token }) => {
  const [customStyles, setCustomStyles] = useState<CustomStyles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchStyles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
        const data = await res.json();

        // Map API data sang CustomStyles nếu cần
        setCustomStyles({
          profileBorderStyle: "solid",
          profileBorderWidth: "1px",
          profileBorderColor: "rgba(139, 92, 246, 0.3)",
          profileBorderRadius: data.profileBorderRadius || "16px",
          profilePadding: "24px",
          profileBackgroundColor: data.profileBackgroundColor || "rgba(31, 41, 55, 0.8)",
          profileOpacity: 1,
          profileBoxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          avatarBorderRadius: data.avatarBorderRadius || "50%",
          avatarShowBorder: true,
          avatarBorderStyle: "solid",
          avatarBorderWidth: "3px",
          avatarBorderColor: "rgba(139, 92, 246, 0.5)",
          usernameFontSize: "24px",
          usernameFontStyle: "normal",
          usernameFontWeight: "600",
          usernameColor: data.usernameColor || "#8b5cf6",
          usernameTextShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
          usernameTextTransform: "none",
          usernameLetterSpacing: "0.5px",
          locationFontSize: "14px",
          locationColor: data.locationColor || "#9ca3af",
          locationFontStyle: "italic",
          cursorWidth: "20px",
          cursorHeight: "20px",
          cursorType: data.customCursor || "crosshair",
          cursorColor: "#8b5cf6",
          cursorFontSize: "12px",
          cursorFontWeight: "500",
          audioTitleFontSize: "18px",
          audioTitleFontWeight: "500",
          audioTitleColor: data.audioTitleColor || "#ffffff",
          audioTitleLetterSpacing: "0.3px",
          coverImageWidth: "300px",
          coverImageHeight: "300px",
          coverImageBorderRadius: "12px",
          coverImageObjectFit: "cover",
          coverImageBorderStyle: "solid",
          coverImageBorderWidth: "2px",
          coverImageBorderColor: "rgba(139, 92, 246, 0.3)",
          coverImageBoxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load styles.");
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, [userId, token]);

  if (loading) return <div className="text-white">Loading style preview...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customStyles) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-orange-300 border-b border-orange-500/30 pb-2">
        👀 Style Preview
      </h3>
      <div
        className="p-6 rounded-lg"
        style={{
          border: `${customStyles.profileBorderWidth} ${customStyles.profileBorderStyle} ${customStyles.profileBorderColor}`,
          borderRadius: customStyles.profileBorderRadius,
          padding: customStyles.profilePadding,
          backgroundColor: customStyles.profileBackgroundColor,
          opacity: customStyles.profileOpacity,
          boxShadow: customStyles.profileBoxShadow,
        }}
      >
        {/* Nội dung preview giống như trước */}
      </div>
    </div>
  );
};

export default StylePreview;
