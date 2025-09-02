import React from "react";
import { type CustomStyles, type ProfileFormData } from "../../../types";
import { useUserStyles } from "./useUserStyles";

const API_BASE_URL =  import.meta.env.VITE_BASE_URL || "http://localhost:5159";


interface QuickStylePresetsProps {
  customStyles: CustomStyles;
  setCustomStyles: React.Dispatch<React.SetStateAction<CustomStyles>>;
  userId: number | null;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

const QuickStylePresets: React.FC<QuickStylePresetsProps> = ({
  customStyles,
  setCustomStyles,
  userId,
  setMessage,
  setFormData,
}) => {
  const { updateUserStyles } = useUserStyles();

  const presets: {
    label: string;
    style: Partial<CustomStyles>;
    gradient: string;
  }[] = [
    {
      label: "💜 Purple Dream",
      style: {
        profileBackgroundColor: "rgba(31, 41, 55, 0.9)",
        usernameColor: "#8b5cf6",
        locationColor: "#9ca3af",
        audioTitleColor: "#ffffff",
        avatarBorderRadius: "50%",
        profileBorderRadius: "16px",
      },
      gradient: "from-purple-600 to-blue-600",
    },
    {
      label: "🌊 Ocean Breeze",
      style: {
        profileBackgroundColor: "rgba(15, 23, 42, 0.9)",
        usernameColor: "#06b6d4",
        locationColor: "#64748b",
        audioTitleColor: "#f0f9ff",
        avatarBorderRadius: "8px",
        profileBorderRadius: "24px",
      },
      gradient: "from-cyan-600 to-blue-600",
    },
    {
      label: "🌿 Forest Zen",
      style: {
        profileBackgroundColor: "rgba(20, 25, 20, 0.9)",
        usernameColor: "#10b981",
        locationColor: "#6b7280",
        audioTitleColor: "#f0fdf4",
        avatarBorderRadius: "50%",
        profileBorderRadius: "12px",
      },
      gradient: "from-green-600 to-emerald-600",
    },
    {
      label: "🔥 Sunset Vibes",
      style: {
        profileBackgroundColor: "rgba(30, 20, 25, 0.9)",
        usernameColor: "#f59e0b",
        locationColor: "#78716c",
        audioTitleColor: "#fffbeb",
        avatarBorderRadius: "16px",
        profileBorderRadius: "20px",
      },
      gradient: "from-amber-600 to-orange-600",
    },
  ];

  const handlePresetClick = async (presetStyle: Partial<CustomStyles>) => {
    const newStyles = { ...customStyles, ...presetStyle };
    setCustomStyles(newStyles);

    if (!userId) {
      setMessage("User ID not found.");
      return;
    }

    try {
      // Gọi API lưu style
      await updateUserStyles(userId, newStyles);

      // Gọi API GET profile mới để cập nhật formData
      const token = localStorage.getItem("authToken") || "";
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch profile: ${response.status}`);
      const data = await response.json();

      // Cập nhật formData
      setFormData((prev) => ({
        ...prev,
        profileAvatar: data.profileAvatar ?? "",
        background: data.background ?? "",
        audio: data.audio ?? "",
        audioImage: data.audioImage ?? "",
        audioTitle: data.audioTitle ?? "",
        customCursor: data.customCursor ?? "crosshair",
        description: data.description ?? "",
        username: data.username ?? "",
        effectUsername: data.effectUsername ?? "glow",
        location: data.location ?? "",
      }));

      setMessage(`Preset applied and saved!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Preset error:", error);
      setMessage("Failed to apply preset.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="mx-4 sm:mx-8 mb-8">
      <div className="bg-gray-900/60 rounded-2xl p-6 border border-purple-500/30 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-purple-400">
          ⚡ Quick Style Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.style)}
              className={`p-4 bg-gradient-to-br ${preset.gradient} rounded-lg text-white font-medium hover:scale-105 transition-transform`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickStylePresets;
