import React, { useState, useRef, useEffect } from "react";
import {
  updateProfile,
  getProfile,
  uploadFile,
  deleteFile,
} from "../../modules/User/services/profileService";
import { API_CONFIG } from "../../configs/ApiConfig";

import type { ProfileData } from "../../modules/User/services/profileService";

interface ProfileFormData {
  profileAvatar: string;
  background: string;
  audio: string;
  customCursor: string;
  description: string;
  username: string;
  effectUsername: string;
  location: string;
}

export const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    profileAvatar: "",
    background: "",
    audio: "",
    customCursor: "crosshair",
    description: "",
    username: "",
    effectUsername: "glow",
    location: "",
  });

  // Lưu đường dẫn cũ để xóa file khi upload file mới
  const [oldFiles, setOldFiles] = useState({
    profileAvatar: "",
    background: "",
    audio: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({
    profileAvatar: false,
    background: false,
    audio: false,
  });
  const [message, setMessage] = useState("");

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bgInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Helper function để tạo URL đầy đủ cho media files
  const getMediaUrl = (path: string) => {
    if (!path) return "";
    // Nếu đã là URL đầy đủ (blob: hoặc http/https) thì return luôn
    if (path.startsWith("blob:") || path.startsWith("http")) return path;
    // Nếu không thì ghép với BASE_URL
    return `${API_CONFIG.BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // --- gọi API lấy profile khi mount ---
// --- gọi API lấy profile khi mount ---
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data = await getProfile("tuibingao");
      console.log("📥 API profile data:", data); // debug xem key API

      if (data) {
        setFormData({
          profileAvatar: data.profileAvatar ?? "",
          background: data.background ?? "",
          audio: data.audio ?? "",
          customCursor: data.customCursor ?? "crosshair",
          description: data.description ?? "",
          username: data.username ?? "",
          effectUsername: data.effectUsername ?? "glow",
          location: data.location ?? "",
        });

        // Lưu đường dẫn cũ
        setOldFiles({
          profileAvatar: data.profileAvatar ?? "",
          background: data.background ?? "",
          audio: data.audio ?? "",
        });
      }
    } catch (err) {
      console.error("❌ Get profile failed:", err);
    }
  };
  fetchProfile();
}, []);


  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProfileFormData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Xác định loại file
    const fileType = field === "audio" ? "audio" : "image";
    
    setUploadingFiles(prev => ({ ...prev, [field]: true }));

    try {
      // Upload file lên server
      const filePath = await uploadFile(file, fileType);

      // Xóa file cũ nếu có
      const oldFilePath = oldFiles[field as keyof typeof oldFiles];
      if (oldFilePath && oldFilePath !== filePath) {
        try {
          await deleteFile(oldFilePath);
        } catch (error) {
          console.warn("Could not delete old file:", oldFilePath);
        }
      }

      // Cập nhật form data với đường dẫn mới
      setFormData((prev) => ({
        ...prev,
        [field]: filePath,
      }));

      // Cập nhật old files
      setOldFiles(prev => ({ ...prev, [field]: filePath }));

      console.log(`✅ ${field} uploaded successfully:`, filePath);
    } catch (error) {
      console.error(`❌ Failed to upload ${field}:`, error);
      setMessage(`❌ Failed to upload ${field}. Please try again.`);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    await updateProfile("tuibingao", {
      profileAvatar: formData.profileAvatar,
      background: formData.background,
      audio: formData.audio,
      customCursor: formData.customCursor,
      description: formData.description,
      username: formData.username,
      effectUsername: formData.effectUsername,
      location: formData.location,
    } as ProfileData);

    setMessage("✅ Profile updated successfully!");
  } catch (err) {
    console.error("Error updating profile:", err);
    setMessage("❌ Failed to update profile.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Update Profile
      </h2>

      {/* Avatar / Background / Audio */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex gap-6 justify-between">
        {/* Avatar */}
        <div
          className="w-32 h-32 border rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative"
          onClick={() => !uploadingFiles.profileAvatar && avatarInputRef.current?.click()}
        >
          {uploadingFiles.profileAvatar ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-xs text-gray-600 mt-1">Uploading...</span>
            </div>
          ) : formData.profileAvatar ? (
            <img
              src={getMediaUrl(formData.profileAvatar)}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Error loading avatar image:", formData.profileAvatar);
                e.currentTarget.style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
              }}
            />
          ) : (
            <span className="text-gray-400 text-sm text-center">
              Click to upload Avatar
            </span>
          )}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "profileAvatar")}
            disabled={uploadingFiles.profileAvatar}
          />
        </div>

        {/* Background */}
        <div
          className="flex-1 h-32 border rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative"
          onClick={() => !uploadingFiles.background && bgInputRef.current?.click()}
        >
          {uploadingFiles.background ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-xs text-gray-600 mt-1">Uploading...</span>
            </div>
          ) : formData.background ? (
            <img
              src={getMediaUrl(formData.background)}
              alt="Background"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Error loading background image:", formData.background);
                e.currentTarget.style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
              }}
            />
          ) : (
            <span className="text-gray-400 text-sm text-center">
              Click to upload Background
            </span>
          )}
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "background")}
            disabled={uploadingFiles.background}
          />
        </div>

        {/* Audio */}
        <div
          className="w-40 h-32 border rounded-lg flex items-center justify-center cursor-pointer p-2 relative"
          onClick={() => !uploadingFiles.audio && !formData.audio && audioInputRef.current?.click()}
        >
          {uploadingFiles.audio ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-xs text-gray-600 mt-1">Uploading...</span>
            </div>
          ) : formData.audio ? (
            <div className="w-full">
              <audio 
                controls 
                className="w-full"
                onError={(e) => {
                  console.error("Error loading audio:", formData.audio);
                }}
              >
                <source src={getMediaUrl(formData.audio)} type="audio/mp3" />
                <source src={getMediaUrl(formData.audio)} type="audio/mpeg" />
                <source src={getMediaUrl(formData.audio)} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  audioInputRef.current?.click();
                }}
                className="mt-1 text-xs text-indigo-600 hover:text-indigo-800"
              >
                Change Audio
              </button>
            </div>
          ) : (
            <span className="text-gray-400 text-sm text-center">
              Click to upload Audio
            </span>
          )}
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "audio")}
            disabled={uploadingFiles.audio}
          />
        </div>
      </div>

      {/* Text fields */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >
        <div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium">Effect Username</label>
            <select
              name="effectUsername"
              value={formData.effectUsername}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="none">None</option>
              <option value="glow">Glow</option>
              <option value="rainbow">Rainbow</option>
              <option value="pulse">Pulse</option>
            </select>
          </div>
        </div>

          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>
{/* 
        <div>
          <label className="block text-sm font-medium">Custom Cursor</label>
          <select
            name="customCursor"
            value={formData.customCursor}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option value="default">Default</option>
            <option value="pointer">Pointer</option>
            <option value="crosshair">Crosshair</option>
            <option value="text">Text</option>
            <option value="wait">Wait</option>
          </select>
        </div> */}

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading || Object.values(uploadingFiles).some(Boolean)}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : Object.values(uploadingFiles).some(Boolean) ? "Uploading files..." : "Update Profile"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 text-center font-semibold ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ProfileForm;