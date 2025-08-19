// AudioProfile.tsx
import React, { useRef } from "react";

interface AudioProfileProps {
  formData: {
    audio: string;
    audioImage: string;
    audioTitle: string;
  };
  uploadingFiles: {
    audio: boolean;
    audioImage: boolean;
  };
  getMediaUrl: (path: string) => string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "audio" | "audioImage"
  ) => void;
}

export const AudioProfile: React.FC<AudioProfileProps> = ({
  formData,
  uploadingFiles,
  getMediaUrl,
  handleChange,
  handleFileChange,
}) => {
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const audioImageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-100 p-7 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-sm">
          <svg
            className="w-6 h-6 text-purple-600 drop-shadow-sm"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Audio Profile</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Cover Image Section */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-700 mb-3 tracking-tight">
            Cover Image
          </label>
          <div className="relative group cursor-pointer">
            <div
              className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 
                         hover:border-purple-400 hover:shadow-lg transition-all duration-300 ease-in-out
                         bg-slate-50 flex items-center justify-center"
              onClick={() => !uploadingFiles.audioImage && audioImageInputRef.current?.click()}
            >
              {formData.audioImage ? (
                <img
                  src={getMediaUrl(formData.audioImage)}
                  alt="Audio Cover"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    console.error("Failed to load audio image:", formData.audioImage);
                    e.currentTarget.src = "https://via.placeholder.com/150?text=No+Cover";
                  }}
                />
              ) : (
                <div className="text-center text-slate-400 space-y-2">
                  <svg
                    className="w-10 h-10 mx-auto opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm font-medium">Upload Cover Image</p>
                </div>
              )}
            </div>

            {/* Uploading Overlay */}
            {uploadingFiles.audioImage && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  <p className="text-xs mt-2 opacity-90">Uploading...</p>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={audioImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "audioImage")}
            />
          </div>
        </div>

        {/* Audio Title & File Section */}
        <div className="space-y-5">
          {/* Audio Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
              Audio Title
            </label>
            <input
              type="text"
              name="audioTitle"
              value={formData.audioTitle}
              onChange={handleChange}
              placeholder="Enter audio title..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl 
                         focus:border-purple-500 focus:ring-4 focus:ring-purple-100 
                         transition-all duration-200 outline-none text-slate-700
                         placeholder-slate-400 text-sm"
            />
          </div>

          {/* Audio File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
              Audio File
            </label>
            <div className="space-y-4">
              {/* File Input */}
              <div className="relative">
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl 
                             file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-none 
                             file:bg-gradient-to-r from-purple-50 to-violet-50 
                             file:text-purple-700 file:font-medium 
                             hover:file:from-purple-100 hover:file:to-violet-100
                             focus:border-purple-500 focus:outline-none transition-all duration-200"
                  onChange={(e) => handleFileChange(e, "audio")}
                />
                {uploadingFiles.audio && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-600"></div>
                  </div>
                )}
              </div>

              {/* Audio Player */}
              {formData.audio && (
                <div className="bg-gradient-to-r from-slate-50 to-purple-25 rounded-2xl p-5 shadow-inner">
                  <audio controls className="w-full rounded-lg">
                    <source src={getMediaUrl(formData.audio)} type="audio/mpeg" />
                    <source src={getMediaUrl(formData.audio)} type="audio/wav" />
                    <p className="text-slate-500 text-sm">Your browser does not support the audio element.</p>
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};