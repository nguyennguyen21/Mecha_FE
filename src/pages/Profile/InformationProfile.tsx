import React, { useRef } from "react";
import type { RefObject } from "react"; // Type-only import for RefObject

interface ProfileFormData {
  profileAvatar: string;
  background: string;
  audio: string;
  audioImage: string;
  audioTitle: string;
  customCursor: string;
  description: string;
  username: string;
  effectUsername: string;
  location: string;
}

interface InformationProfileProps {
  formData: ProfileFormData;
  uploadingFiles: {
    profileAvatar: boolean;
    background: boolean;
  };
  getMediaUrl: (path: string) => string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileAvatar" | "background"
  ) => void;
}

const InformationProfile: React.FC<InformationProfileProps> = ({
  formData,
  uploadingFiles,
  getMediaUrl,
  handleChange,
  handleFileChange,
}) => {
const avatarInputRef = useRef<HTMLInputElement>(null);
const bgInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`relative mb-12 ${
        formData.customCursor === "crosshair"
          ? "cursor-crosshair"
          : formData.customCursor === "pointer"
          ? "cursor-pointer"
          : formData.customCursor === "help"
          ? "cursor-help"
          : "cursor-default"
      }`}
    >
      {/* Background Section */}
      <div
        className="w-full h-96 rounded-3xl overflow-hidden relative cursor-pointer group shadow-2xl ring-1 ring-gray-700/20 transition-all duration-500 hover:shadow-3xl hover:ring-gray-600/30"
        onClick={() => !uploadingFiles.background && bgInputRef.current?.click()}
      >
        {formData.background ? (
          <img
            src={
              getMediaUrl(formData.background) ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
            }
            alt="Background"
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-300">
            <div className="w-16 h-16 mb-4 bg-gray-800/50 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 opacity-80"
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
            </div>
            <p className="text-lg font-semibold tracking-wide">
              Upload Background Image
            </p>
          </div>
        )}
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "background")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        {uploadingFiles.background && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-pulse">
            <div className="flex flex-col items-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400"></div>
              <p className="text-base mt-4 font-medium opacity-90">
                Uploading Background...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Avatar & Username */}
      <div className="relative flex items-end gap-6 -mt-20 px-6 sm:px-12">
        <div className="relative group">
          <div
            className="w-40 h-40 rounded-full border-4 border-gray-800 overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 transform hover:shadow-3xl hover:scale-105 bg-gray-900 ring-2 ring-gray-700/40"
            onClick={() =>
              !uploadingFiles.profileAvatar && avatarInputRef.current?.click()
            }
          >
            {formData.profileAvatar ? (
              <img
                src={
                  getMediaUrl(formData.profileAvatar) ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-gray-300">
                <svg
                  className="w-12 h-12 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "profileAvatar")}
            />
          </div>
          {uploadingFiles.profileAvatar && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-400"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center py-4">
          <h1
            className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-r 
                        ${
                          formData.effectUsername === "glow"
                            ? "from-blue-400 via-purple-400 to-pink-400 animate-pulse"
                            : formData.effectUsername === "rainbow"
                            ? "from-red-400 via-yellow-400 to-blue-400"
                            : formData.effectUsername === "pulse"
                            ? "from-purple-500 to-purple-500 animate-pulse"
                            : "from-gray-300 to-gray-100"
                        } 
                        bg-clip-text text-transparent drop-shadow-lg transition-transform duration-300 hover:scale-105`}
          >
            {formData.username || "Your Name"}
          </h1>
          <p className="text-gray-400 max-w-md mt-3 text-base sm:text-lg leading-relaxed italic font-light tracking-wide drop-shadow-md">
            {formData.description || "Tell the world who you are."}
          </p>
        </div>
      </div>

      {/* Profile Information Form */}
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700/30 p-8 mt-8 mx-6 sm:mx-12 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-200 tracking-tight">
            Profile Information
          </h2>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Username
              </label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 text-gray-300 placeholder-gray-500 bg-gray-800/80"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Username Effect
              </label>
              <select
                name="effectUsername"
                value={formData.effectUsername}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 bg-gray-800/80 text-sm text-gray-300"
              >
                <option value="none">None</option>
                <option value="glow">Glow</option>
                <option value="rainbow">Rainbow</option>
                <option value="pulse">Pulse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 resize-none text-gray-300 placeholder-gray-500 bg-gray-800/80"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Location
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 text-gray-300 placeholder-gray-500 bg-gray-800/80"
                  placeholder="Where are you from?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Custom Cursor
              </label>
              <select
                name="customCursor"
                value={formData.customCursor}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 bg-gray-800/80 text-sm text-gray-300"
              >
                <option value="default">Default</option>
                <option value="pointer">Pointer</option>
                <option value="crosshair">Crosshair</option>
                <option value="help">Help</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationProfile;