// InformationProfile.tsx
import React, { useRef } from "react";

interface InformationProfileProps {
  formData: {
    profileAvatar: string;
    background: string;
    username: string;
    effectUsername: string;
    description: string;
    location: string;
    customCursor: string;
  };
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

export const InformationProfile: React.FC<InformationProfileProps> = ({
  formData,
  uploadingFiles,
  getMediaUrl,
  handleChange,
  handleFileChange,
}) => {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bgInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="relative mb-8">
      {/* Background Section */}
      <div
        className="w-full h-80 rounded-3xl overflow-hidden relative cursor-pointer group shadow-2xl 
                   ring-1 ring-white/10 transform transition-all duration-300 hover:shadow-3xl"
        onClick={() => !uploadingFiles.background && bgInputRef.current?.click()}
      >
        {formData.background ? (
          <img
            src={getMediaUrl(formData.background)}
            alt="Background"
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/1200x400?text=Background+Failed";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black text-slate-300">
            <div className="w-16 h-16 mb-4 bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
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
            <p className="text-lg font-semibold tracking-wide">Click to upload Background</p>
          </div>
        )}
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "background")}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>

        {/* Uploading overlay */}
        {uploadingFiles.background && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fade-in">
            <div className="flex flex-col items-center text-white">
              <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-white"></div>
              <p className="text-sm mt-3 font-medium opacity-90">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Avatar & Username */}
      <div className="relative flex items-center gap-8 -mt-16 px-8 sm:px-10">
        {/* Avatar */}
        <div className="relative group">
          <div
            className="w-36 h-36 rounded-3xl border-4 border-white overflow-hidden cursor-pointer 
                       shadow-2xl transition-all duration-300 transform 
                       hover:shadow-3xl hover:scale-105 bg-white ring-2 ring-white/30"
            onClick={() =>
              !uploadingFiles.profileAvatar && avatarInputRef.current?.click()
            }
          >
            {formData.profileAvatar ? (
              <img
                src={getMediaUrl(formData.profileAvatar)}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 text-slate-700">
                <svg
                  className="w-10 h-10 opacity-70"
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
            <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Username & Description */}
        <div className="flex flex-col justify-center py-2">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg leading-tight">
            {formData.username || "Your Name"}
          </h1>
          <p className="text-slate-200 max-w-lg mt-2 text-sm sm:text-base leading-relaxed drop-shadow-md">
            {formData.description || "Tell the world who you are."}
          </p>
        </div>
      </div>

      {/* Profile Information Form */}
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-7 mt-20 mx-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center gap-4 mb-7">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
            <svg
              className="w-6 h-6 text-blue-600"
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
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Profile Information</h2>
        </div>

        <div className="space-y-7">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl 
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                           outline-none transition-all duration-200 
                           text-slate-700 placeholder-slate-400 text-sm"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
                Username Effect
              </label>
              <select
                name="effectUsername"
                value={formData.effectUsername}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl 
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                           outline-none transition-all duration-200 
                           bg-white text-sm"
              >
                <option value="none">None</option>
                <option value="glow">Glow</option>
                <option value="rainbow">Rainbow</option>
                <option value="pulse">Pulse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl 
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                         outline-none transition-all duration-200 resize-none 
                         text-slate-700 placeholder-slate-400 text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
                Location
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-slate-400"
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
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl 
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                             outline-none transition-all duration-200 
                             text-slate-700 placeholder-slate-400 text-sm"
                  placeholder="Where are you from?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
                Custom Cursor
              </label>
              <select
                name="customCursor"
                value={formData.customCursor}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl 
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                           outline-none transition-all duration-200 
                           bg-white text-sm"
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