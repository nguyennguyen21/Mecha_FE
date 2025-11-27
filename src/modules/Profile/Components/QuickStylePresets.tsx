import React from "react";
import { type CustomStyles, type ProfileFormData } from "../../../types";
import { useUserStyles } from "./useUserStyles";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5159';


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
    name: string;
    description: string;
    style: Partial<CustomStyles>;
    icon: React.ReactNode;
  }[] = [
    {
      name: "Purple Dream",
      description: "Elegant purple theme",
      style: {
        profileBackgroundColor: "rgba(30, 20, 50, 0.8)",
        usernameColor: "#8b5cf6",
        locationColor: "#9ca3af",
        audioTitleColor: "#ffffff",
        avatarBorderRadius: "50%",
        profileBorderRadius: "16px",
        profileBorderColor: "rgba(139, 92, 246, 0.3)",
      },
      icon: <i className="fas fa-moon text-2xl"></i>,
    },
    {
      name: "Ocean Breeze",
      description: "Fresh cyan theme",
      style: {
        profileBackgroundColor: "rgba(15, 23, 42, 0.9)",
        usernameColor: "#06b6d4",
        locationColor: "#64748b",
        audioTitleColor: "#f0f9ff",
        avatarBorderRadius: "8px",
        profileBorderRadius: "24px",
        profileBorderColor: "rgba(6, 182, 212, 0.3)",
      },
      icon: <i className="fas fa-water text-2xl"></i>,
    },
    {
      name: "Nature Green",
      description: "Natural green theme",
      style: {
        profileBackgroundColor: "rgba(20, 25, 20, 0.9)",
        usernameColor: "#10b981",
        locationColor: "#6b7280",
        audioTitleColor: "#f0fdf4",
        avatarBorderRadius: "50%",
        profileBorderRadius: "12px",
        profileBorderColor: "rgba(16, 185, 129, 0.3)",
      },
      icon: <i className="fas fa-leaf text-2xl"></i>,
    },
    {
      name: "Sunset Fire",
      description: "Warm orange theme",
      style: {
        profileBackgroundColor: "rgba(30, 20, 25, 0.9)",
        usernameColor: "#f59e0b",
        locationColor: "#78716c",
        audioTitleColor: "#fffbeb",
        avatarBorderRadius: "16px",
        profileBorderRadius: "20px",
        profileBorderColor: "rgba(245, 158, 11, 0.3)",
      },
      icon: <i className="fas fa-sun text-2xl"></i>,
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
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        <div className="bg-purple-600/20 border-b border-gray-700/50 p-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
            <i className="fas fa-magic text-purple-400"></i>
            Quick Style Presets
          </h3>
          <p className="text-gray-400 text-sm">Choose a preset to quickly style your profile</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetClick(preset.style)}
                className={`
                  group relative overflow-hidden rounded-xl p-6 
                  bg-purple-600
                  text-white font-medium 
                  hover:scale-105 transition-all duration-300 
                  cursor-pointer shadow-lg hover:shadow-xl
                  border-2 border-white/20 hover:border-white/40
                `}
                style={{
                  backgroundColor: preset.name === "Purple Dream" ? "#8b5cf6" :
                                  preset.name === "Ocean Breeze" ? "#06b6d4" :
                                  preset.name === "Nature Green" ? "#10b981" :
                                  "#f59e0b"
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg mb-1">{preset.name}</div>
                    <div className="text-sm opacity-90">{preset.description}</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStylePresets;
