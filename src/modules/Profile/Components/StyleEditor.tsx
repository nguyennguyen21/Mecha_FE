// src/components/StyleEditor.tsx
import React, { useState } from "react";

export interface CustomStyles {
  profileBorderWidth: string;
  profileBorderStyle: string;
  profileBorderColor: string;
  profileBorderRadius: string;
  profilePadding: string;
  profileBackgroundColor: string;
  profileOpacity: string;
  profileBoxShadow: string;
}

const StyleEditor: React.FC = () => {
  const [customStyles, setCustomStyles] = useState<CustomStyles>({
    profileBorderWidth: "2px",
    profileBorderStyle: "solid",
    profileBorderColor: "#ff6b6b",
    profileBorderRadius: "12px",
    profilePadding: "20px",
    profileBackgroundColor: "#f8f9fa",
    profileOpacity: "1",
    profileBoxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  });

  const handleStyleChange = (styleKey: keyof CustomStyles, value: string) => {
    setCustomStyles((prev) => ({ ...prev, [styleKey]: value }));
  };

  return (
    <div className="p-4 grid grid-cols-2 gap-6">
      {/* Bên trái: form chỉnh style */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg">🎨 Tuỳ chỉnh Style</h2>

        <label className="block">
          Border Width
          <input
            type="text"
            value={customStyles.profileBorderWidth}
            onChange={(e) =>
              handleStyleChange("profileBorderWidth", e.target.value)
            }
            className="border rounded w-full px-2 py-1"
          />
        </label>

        <label className="block">
          Border Style
          <select
            value={customStyles.profileBorderStyle}
            onChange={(e) =>
              handleStyleChange("profileBorderStyle", e.target.value)
            }
            className="border rounded w-full px-2 py-1"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
            <option value="groove">Groove</option>
          </select>
        </label>

        <label className="block">
          Border Color
          <input
            type="color"
            value={customStyles.profileBorderColor}
            onChange={(e) =>
              handleStyleChange("profileBorderColor", e.target.value)
            }
            className="w-full h-10 border rounded"
          />
        </label>

        <label className="block">
          Border Radius
          <input
            type="text"
            value={customStyles.profileBorderRadius}
            onChange={(e) =>
              handleStyleChange("profileBorderRadius", e.target.value)
            }
            className="border rounded w-full px-2 py-1"
          />
        </label>

        <label className="block">
          Padding
          <input
            type="text"
            value={customStyles.profilePadding}
            onChange={(e) =>
              handleStyleChange("profilePadding", e.target.value)
            }
            className="border rounded w-full px-2 py-1"
          />
        </label>

        <label className="block">
          Background Color
          <input
            type="color"
            value={customStyles.profileBackgroundColor}
            onChange={(e) =>
              handleStyleChange("profileBackgroundColor", e.target.value)
            }
            className="w-full h-10 border rounded"
          />
        </label>

        <label className="block">
          Opacity (0 - 1)
          <input
            type="text"
            value={customStyles.profileOpacity}
            onChange={(e) =>
              handleStyleChange("profileOpacity", e.target.value)
            }
            className="border rounded w-full px-2 py-1"
          />
        </label>

        <label className="block">
          Box Shadow
          <input
            type="text"
            value={customStyles.profileBoxShadow}
            onChange={(e) =>
              handleStyleChange("profileBoxShadow", e.target.value)
            }
            className="border rounded w-full px-2 py-1"
          />
        </label>
      </div>

      {/* Bên phải: preview */}
      <div className="flex items-center justify-center">
        <div
          style={{
            borderWidth: customStyles.profileBorderWidth,
            borderStyle: customStyles.profileBorderStyle,
            borderColor: customStyles.profileBorderColor,
            borderRadius: customStyles.profileBorderRadius,
            padding: customStyles.profilePadding,
            backgroundColor: customStyles.profileBackgroundColor,
            opacity: parseFloat(customStyles.profileOpacity),
            boxShadow: customStyles.profileBoxShadow,
          }}
          className="w-64 h-64 flex items-center justify-center text-center font-semibold"
        >
          Preview Box
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
