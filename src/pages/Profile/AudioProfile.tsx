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

const AudioProfile: React.FC<AudioProfileProps> = ({
  formData,
  uploadingFiles,
  getMediaUrl,
  handleChange,
  handleFileChange,
}) => {
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const audioImageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 rounded-2xl flex items-center justify-center shadow-md">
          <svg
            className="w-6 h-6 text-purple-700 dark:text-purple-300 drop-shadow-sm"
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
          Audio Profile
        </h2>
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Cover Image Section */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-tight">
            Cover Image
          </label>
          <div className="relative group cursor-pointer">
            <div
              className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:shadow-xl transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 flex items-center justify-center"
              onClick={() => !uploadingFiles.audioImage && audioImageInputRef.current?.click()}
            >
              {formData.audioImage ? (
                <img
                  src={getMediaUrl(formData.audioImage) || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"}
                  alt="Audio Cover"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center text-gray-400 dark:text-gray-500 space-y-3">
                  <svg
                    className="w-12 h-12 mx-auto opacity-70"
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
                  <p className="text-sm font-medium tracking-wide">Upload Cover Image</p>
                </div>
              )}
            </div>
            {uploadingFiles.audioImage && (
              <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center animate-pulse">
                <div className="flex flex-col items-center text-white">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
                  <p className="text-sm mt-3 font-medium opacity-90">Uploading Cover...</p>
                </div>
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
        </div>

        {/* Audio Title & File Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-tight">
              Audio Title
            </label>
            <input
              type="text"
              name="audioTitle"
              onChange={handleChange}
              placeholder="Enter audio title..."
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-300/50 outline-none transition-all duration-200 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-tight">
              Audio File
            </label>
            <div className="space-y-5">
              <div className="relative">
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-none file:bg-gradient-to-r file:from-purple-100 file:to-violet-100 dark:file:from-purple-800 dark:file:to-violet-800 file:text-purple-700 dark:file:text-purple-300 file:font-medium hover:file:from-purple-200 hover:file:to-violet-200 dark:hover:file:from-purple-700 dark:hover:file:to-violet-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-300/50 outline-none transition-all duration-200 bg-white dark:bg-gray-800"
                  onChange={(e) => handleFileChange(e, "audio")}
                />
                {uploadingFiles.audio && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {formData.audio && (
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/50 rounded-2xl p-4 shadow-inner">
                  <audio
                    controls
                    className="w-full rounded-lg bg-white dark:bg-gray-800 shadow-md"
                    style={{ height: "48px" }}
                  >
                    <source src={getMediaUrl(formData.audio)} type="audio/mpeg" />
                    <source src={getMediaUrl(formData.audio)} type="audio/wav" />
                    <p className="text-gray-500 text-sm">
                      Your browser does not support the audio element.
                    </p>
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

export default AudioProfile;