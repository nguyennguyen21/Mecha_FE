import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface MarginEditorProps {
  customStyles: any;
  onChange: (field: string, value: string) => void;
}

const MarginEditor: React.FC<MarginEditorProps> = ({ customStyles, onChange }) => {
  const [activePreset, setActivePreset] = useState<string>("");

  const marginFields = [
    { key: "avatarMargin", label: "Avatar", icon: "👤" },
    { key: "usernameMargin", label: "Username", icon: "🏷️" },
    { key: "descriptionMargin", label: "Description", icon: "📝" },
    { key: "locationMargin", label: "Location", icon: "📍" },
    { key: "audioMargin", label: "Audio", icon: "🎵" }, // Gộp audio
  ];

  const presets = [
    { name: "Compact", values: "4px 4px 4px 4px" },
    { name: "Normal", values: "8px 8px 8px 8px" },
    { name: "Spacious", values: "16px 16px 16px 16px" },
    { name: "Extra Large", values: "24px 24px 24px 24px" },
  ];

  const [previewVisible, setPreviewVisible] = useState<Record<string, boolean>>(
    () => marginFields.reduce((acc, f) => ({ ...acc, [f.key]: false }), {})
  );

  const parseMargin = (margin: string) => {
    if (!margin) return ["0", "0", "0", "0"];
    const parts = margin.split(" ").map((v) => v.replace("px", "").trim());
    while (parts.length < 4) parts.push("0");
    return parts.slice(0, 4);
  };

  const joinMargin = (arr: string[]) => arr.map(v => v + "px").join(" ");

  const applyPreset = (field: string, values: string) => onChange(field, values);

  const applyToAll = (values: string) => {
    marginFields.forEach(field => onChange(field.key, values));
    setActivePreset(values);
  };

  return (
    <div className="space-y-6 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          📐 Margin Editor
        </h3>
        <button
          className="text-sm px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
          onClick={() => applyToAll("0px 0px 0px 0px")}
        >
          Reset All
        </button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300">Quick Presets (Apply to All)</h4>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyToAll(preset.values)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                activePreset === preset.values
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              {preset.name}
              <div className="text-xs opacity-75 mt-1">{preset.values}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-300">Individual Element Controls</h4>
        
        {marginFields.map((field) => {
          const [top, right, bottom, left] = parseMargin(customStyles[field.key] || "0px 0px 0px 0px");
          
          return (
            <div key={field.key} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <label className="text-white font-medium flex items-center gap-2">
                  <span className="text-lg">{field.icon}</span>
                  {field.label}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPreviewVisible((prev) => ({ ...prev, [field.key]: !prev[field.key] }))
                    }
                    className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-gray-200 transition-colors"
                  >
                    {previewVisible[field.key] ? "Hide Preview" : "Show Preview"}
                  </button>
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(field.key, preset.values)}
                      className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-gray-200 transition-colors"
                      title={`Apply ${preset.name} (${preset.values})`}
                    >
                      {preset.name}
                    </button>
                  ))}
                  <button
                    className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                    onClick={() => onChange(field.key, "0px 0px 0px 0px")}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Visual Margin Box */}
              {previewVisible[field.key] && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <div className="text-center text-xs text-gray-400 mb-2">Visual Preview</div>
                  <div className="relative">
                    <div 
                      className="border-2 border-dashed border-blue-400 bg-blue-400/10"
                      style={{ 
                        padding: `${top}px ${right}px ${bottom}px ${left}px`,
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div className="bg-white/20 px-3 py-1 rounded text-xs text-white flex items-center gap-2">
                        {field.icon} {field.label}
                      </div>
                    </div>
                    {/* Labels */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-400">{top}px</div>
                    <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-xs text-blue-400">{right}px</div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-400">{bottom}px</div>
                    <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-xs text-blue-400">{left}px</div>
                  </div>
                </div>
              )}

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-4">
                {["Top", "Right", "Bottom", "Left"].map((dir, idx) => {
                  const values = [top, right, bottom, left];
                  return (
                    <div key={dir}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">{dir}</span>
                        <span className="text-sm text-blue-400 font-mono">{values[idx]}px</span>
                      </div>
                      <Slider
                        value={parseInt(values[idx])}
                        onChange={(val) => {
                          const newValues = [...values];
                          newValues[idx] = val.toString();
                          onChange(field.key, joinMargin(newValues));
                        }}
                        min={0}
                        max={100}
                        trackStyle={{ backgroundColor: "#60a5fa" }}
                        handleStyle={{ borderColor: "#60a5fa", backgroundColor: "#ffffff" }}
                        railStyle={{ backgroundColor: "#4b5563" }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Quick Input */}
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-300 mb-2">Quick Input (Top Right Bottom Left)</div>
                <input
                  type="text"
                  value={`${top}px ${right}px ${bottom}px ${left}px`}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder="10px 15px 10px 15px"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-700/30 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">
          💡 <strong>Tips:</strong> Use sliders for precise control, presets for quick setup, or type values directly. 
          The visual preview shows how margin affects spacing around each element.
        </p>
      </div>
    </div>
  );
};

export default MarginEditor;
