import React from "react";
import { type ProfileFormData, type FileState, type CustomStyles } from "../../types"; 


interface QuickStylePresetsProps {
  customStyles: CustomStyles;
  setCustomStyles: React.Dispatch<React.SetStateAction<CustomStyles>>;
}

const QuickStylePresets: React.FC<QuickStylePresetsProps> = ({
  customStyles,
  setCustomStyles,
}) => {
  return (
    <div className="mx-4 sm:mx-8 mb-8">
      <div className="bg-gray-900/60 rounded-2xl p-6 border border-purple-500/30 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-purple-400">
          ⚡ Quick Style Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() =>
              setCustomStyles({
                ...customStyles,
                profileBackgroundColor: "rgba(31, 41, 55, 0.9)",
                usernameColor: "#8b5cf6",
                locationColor: "#9ca3af",
                audioTitleColor: "#ffffff",
                avatarBorderRadius: "50%",
                profileBorderRadius: "16px",
              })
            }
            className="p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:scale-105 transition-transform"
          >
            💜 Purple Dream
          </button>
          <button
            onClick={() =>
              setCustomStyles({
                ...customStyles,
                profileBackgroundColor: "rgba(15, 23, 42, 0.9)",
                usernameColor: "#06b6d4",
                locationColor: "#64748b",
                audioTitleColor: "#f0f9ff",
                avatarBorderRadius: "8px",
                profileBorderRadius: "24px",
              })
            }
            className="p-4 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg text-white font-medium hover:scale-105 transition-transform"
          >
            🌊 Ocean Breeze
          </button>
          <button
            onClick={() =>
              setCustomStyles({
                ...customStyles,
                profileBackgroundColor: "rgba(20, 25, 20, 0.9)",
                usernameColor: "#10b981",
                locationColor: "#6b7280",
                audioTitleColor: "#f0fdf4",
                avatarBorderRadius: "50%",
                profileBorderRadius: "12px",
              })
            }
            className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg text-white font-medium hover:scale-105 transition-transform"
          >
            🌿 Forest Zen
          </button>
          <button
            onClick={() =>
              setCustomStyles({
                ...customStyles,
                profileBackgroundColor: "rgba(30, 20, 25, 0.9)",
                usernameColor: "#f59e0b",
                locationColor: "#78716c",
                audioTitleColor: "#fffbeb",
                avatarBorderRadius: "16px",
                profileBorderRadius: "20px",
              })
            }
            className="p-4 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg text-white font-medium hover:scale-105 transition-transform"
          >
            🔥 Sunset Vibes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickStylePresets;