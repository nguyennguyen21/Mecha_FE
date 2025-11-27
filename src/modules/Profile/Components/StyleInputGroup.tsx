import React, { useState } from "react";
import { ChromePicker } from "react-color";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Option {
  value: string;
  label: string;
}

interface StyleInputGroupProps {
  label: string;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  type: "text" | "slider" | "color" | "select" | "checkbox";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Option[];
  disabled?: boolean;
}

const StyleInputGroup: React.FC<StyleInputGroupProps> = ({
  label,
  value,
  onChange,
  type,
  placeholder,
  min,
  max,
  step,
  options,
  disabled,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="relative bg-gray-800/40 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-colors">
      <label className="block text-sm font-semibold mb-3 text-gray-200 flex items-center gap-2">
        {label}
        {type === "slider" && (
          <span className="text-xs font-mono text-blue-400 bg-blue-400/20 px-2 py-0.5 rounded">
            {typeof value === "number" ? value.toFixed(step === 0.1 ? 1 : 0) : value}
            {typeof value === "number" && (min || max) ? "px" : ""}
          </span>
        )}
      </label>
      {type === "text" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
        />
      )}
      {type === "slider" && (
        <div className="px-1">
          <Slider
            value={value as number}
            onChange={(val) => onChange(val as number)}
            min={min}
            max={max}
            step={step}
            trackStyle={{ backgroundColor: "#8b5cf6", height: 6 }}
            handleStyle={{ 
              borderColor: "#8b5cf6", 
              backgroundColor: "#ffffff",
              width: 18,
              height: 18,
              marginTop: -6,
              boxShadow: "0 2px 4px rgba(139, 92, 246, 0.4)"
            }}
            railStyle={{ backgroundColor: "#4b5563", height: 6 }}
          />
        </div>
      )}
      {type === "color" && (
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer shadow-md hover:scale-105 transition-transform"
            style={{ backgroundColor: value as string }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 p-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            placeholder="#000000"
          />
          {showColorPicker && (
            <div className="absolute z-50 mt-2 left-0">
              <div className="bg-gray-800 rounded-lg p-2 border border-gray-700 shadow-2xl">
                <ChromePicker
                  color={value as string}
                  onChange={(color) => onChange(color.hex)}
                  disableAlpha={false}
                />
                <button
                  className="mt-2 w-full text-sm text-white bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors"
                  onClick={() => setShowColorPicker(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {type === "select" && (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-50"
          disabled={disabled}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {type === "checkbox" && (
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only peer"
              disabled={disabled}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            <span className="ml-3 text-sm text-gray-300">
              {value ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default StyleInputGroup;