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
        className="w-full h-80 rounded-2xl overflow-hidden relative cursor-pointer group shadow-2xl"
        onClick={() => !uploadingFiles.background && bgInputRef.current?.click()}
      >
        {formData.background ? (
          <img
            src={getMediaUrl(formData.background)}
            alt="Background"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/1200x400?text=Background+Failed";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300">
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8"
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
            <p className="text-lg font-medium">Click to upload Background</p>
          </div>
        )}
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "background")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        {uploadingFiles.background && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Avatar & Username */}
      <div className="relative flex items-center gap-6 -mt-16 px-8">
        {/* Avatar */}
        <div className="relative">
          <div
            className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden cursor-pointer shadow-2xl group bg-white"
            onClick={() =>
              !uploadingFiles.profileAvatar && avatarInputRef.current?.click()
            }
          >
            {formData.profileAvatar ? (
              <img
                src={getMediaUrl(formData.profileAvatar)}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600">
                <svg
                  className="w-8 h-8"
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
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Username & Description */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-1">
            {formData.username || "Username"}
          </h1>
          <p className="text-slate-300 max-w-md">{formData.description || "No description"}</p>
        </div>
      </div>

      {/* Profile Information Form */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mt-20 mx-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
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
          <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none transition-colors"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username Effect</label>
              <select
                name="effectUsername"
                value={formData.effectUsername}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none transition-colors bg-white"
              >
                <option value="none">None</option>
                <option value="glow">Glow</option>
                <option value="rainbow">Rainbow</option>
                <option value="pulse">Pulse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
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
                  className="w-full border-2 border-slate-200 rounded-xl p-3 pl-11 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Where are you from?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Custom Cursor</label>
              <select
                name="customCursor"
                value={formData.customCursor}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none transition-colors bg-white"
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
