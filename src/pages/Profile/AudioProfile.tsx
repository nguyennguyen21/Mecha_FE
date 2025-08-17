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
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Audio Profile</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Cover Image</label>
          <div className="relative">
            <div
              className="aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 border-dashed border-slate-300 hover:border-purple-400 transition-colors"
              onClick={() => !uploadingFiles.audioImage && audioImageInputRef.current?.click()}
            >
              {formData.audioImage ? (
                <img
                  src={getMediaUrl(formData.audioImage)}
                  alt="Audio Cover"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error("Failed to load audio image:", formData.audioImage);
                    e.currentTarget.src = "https://via.placeholder.com/150?text=Audio+Cover+Failed";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm">Upload Cover</p>
                </div>
              )}
              <input
                ref={audioImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "audioImage")}
              />
            </div>
            {uploadingFiles.audioImage && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Audio Title</label>
            <input
              type="text"
              name="audioTitle"
              value={formData.audioTitle}
              onChange={handleChange}
              placeholder="Enter audio title"
              className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-purple-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Audio File</label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-purple-400 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  onChange={(e) => handleFileChange(e, "audio")}
                />
                {uploadingFiles.audio && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {formData.audio && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <audio controls className="w-full">
                    <source src={getMediaUrl(formData.audio)} type="audio/mpeg" />
                    <source src={getMediaUrl(formData.audio)} type="audio/wav" />
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