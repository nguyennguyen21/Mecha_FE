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
    <div className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      {type === "text" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm disabled:opacity-50"
        />
      )}
      {type === "slider" && (
        <div>
          <Slider
            value={value as number}
            onChange={(val) => onChange(val as number)}
            min={min}
            max={max}
            step={step}
            trackStyle={{ backgroundColor: "#8b5cf6" }}
            handleStyle={{ borderColor: "#8b5cf6", backgroundColor: "#ffffff" }}
            railStyle={{ backgroundColor: "#4b5563" }}
          />
          <span className="text-xs text-gray-400 mt-1 block">
            {typeof value === "number" ? value.toFixed(step === 0.1 ? 1 : 0) : value}
            {typeof value === "number" && (min || max) ? "px" : ""}
          </span>
        </div>
      )}
      {type === "color" && (
        <div>
          <div
            className="w-10 h-10 rounded border-2 cursor-pointer"
            style={{ backgroundColor: value as string }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <div className="absolute z-10 mt-2">
              <ChromePicker
                color={value as string}
                onChange={(color) => onChange(color.hex)}
                disableAlpha={false}
              />
              <button
                className="mt-2 text-sm text-white bg-gray-800 p-2 rounded"
                onClick={() => setShowColorPicker(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
      {type === "select" && (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
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
        <input
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default StyleInputGroup;