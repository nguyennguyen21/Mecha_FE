import React from "react";
import StyleInputGroup from "../../Components/StyleInputGroup";

interface CursorSectionProps {
  customStyles: any;
  handleStyleChange: (key: string, value: any) => void;
}

const CursorSection: React.FC<CursorSectionProps> = ({
  customStyles,
  handleStyleChange
}) => {
  const { customCursor, cursorSize } = customStyles;

  const size = parseInt(cursorSize ?? "40", 10);

  // preview style cho cursor custom (ảnh)
  const previewStyle: React.CSSProperties = {
    width: size + "px",
    height: size + "px",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: customCursor ? `url(${customCursor})` : "none",
    border: "1px dashed #555",
    borderRadius: "6px"
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-indigo-500/30 pb-2">
        🖱️ Custom Cursor (Image)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Nhập URL ảnh */}
        <StyleInputGroup
          label="Cursor Image URL"
          value={customCursor || ""}
          onChange={(value) => handleStyleChange("customCursor", value)}
          type="text"
          placeholder="https://example.com/cursor.png"
        />

        {/* Upload ảnh */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Upload Cursor</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  handleStyleChange("customCursor", ev.target?.result);
                };
                reader.readAsDataURL(file); // chuyển thành base64 để preview
              }
            }}
            className="block w-full text-sm text-gray-300 
                       border border-gray-600 rounded-lg p-2 
                       file:mr-3 file:py-1 file:px-3 
                       file:rounded-md file:border-0 
                       file:bg-indigo-600 file:text-white 
                       hover:file:bg-indigo-500"
          />
        </div>

        {/* Cursor Size (width = height) */}
        <StyleInputGroup
          label="Cursor Size"
          value={size}
          onChange={(value) => handleStyleChange("cursorSize", `${value}`)}
          type="slider"
          min={8}
          max={128}
          step={1}
        />
      </div>

      {/* Preview box */}
      <div className="mt-6">
        <p className="text-gray-400 text-sm mb-2">Preview:</p>
        <div className="w-24 h-24 flex items-center justify-center bg-gray-800 rounded-lg">
          <div style={previewStyle}></div>
        </div>
      </div>
    </div>
  );
};

export default CursorSection;
