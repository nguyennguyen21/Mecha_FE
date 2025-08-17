// ProfileForm.tsx
import React, { useState, useEffect } from "react";
import { updateProfile, getProfile, uploadFile, deleteFile } from "../../modules/User/services/profileService";
import { API_CONFIG } from "../../configs/ApiConfig";
import { InformationProfile } from "./InformationProfile";
import { AudioProfile } from "./AudioProfile";
import type { ProfileData } from "../../modules/User/services/profileService";

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

export const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    profileAvatar: "",
    background: "",
    audio: "",
    audioImage: "",
    audioTitle: "",
    customCursor: "crosshair",
    description: "",
    username: "",
    effectUsername: "glow",
    location: "",
  });

  const [oldFiles, setOldFiles] = useState({
    profileAvatar: "",
    background: "",
    audio: "",
    audioImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({
    profileAvatar: false,
    background: false,
    audio: false,
    audioImage: false,
  });
  const [message, setMessage] = useState("");

  const getMediaUrl = (path: string) => {
    if (!path) return "";
    const url = path.startsWith("blob:") || path.startsWith("http")
      ? path
      : `${API_CONFIG.BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    console.log(`🔹 Generated URL for path ${path}:`, url);
    return url;
  };

  useEffect(() => {
    console.log("🔹 Profile data on mount:", formData);
  }, [formData]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile("tuibingao");
        console.log("🔹 Raw profile data:", data);
        if (data) {
          const profileData = {
            profileAvatar: data.profileAvatar ?? "",
            background: data.background ?? "",
            audio: data.audio ?? "",
            audioImage: data.audioImage ?? "",
            audioTitle: data.audioTitle ?? "",
            customCursor: data.customCursor ?? "crosshair",
            description: data.description ?? "",
            username: data.username ?? "",
            effectUsername: data.effectUsername ?? "glow",
            location: data.location ?? "",
          };
          setFormData(profileData);
          setOldFiles({
            profileAvatar: data.profileAvatar ?? "",
            background: data.background ?? "",
            audio: data.audio ?? "",
            audioImage: data.audioImage ?? "",
          });
          console.log("🔹 Profile loaded successfully:", profileData);
        }
      } catch (err) {
        console.error("❌ Get profile failed:", err);
        setMessage("❌ Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(`🔹 Field ${name} updated:`, value);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProfileFormData
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("🔹 No file selected for", field);
      return;
    }
    const fileType = field === "audio" ? "audio" : "image";
    setUploadingFiles(prev => ({ ...prev, [field]: true }));
    try {
      console.log(`🔄 Uploading ${field}:`, file.name);
      const filePath = await uploadFile(file, fileType);
      console.log(`✅ Upload ${field} success:`, filePath);
      const oldFilePath = oldFiles[field as keyof typeof oldFiles];
      if (oldFilePath && oldFilePath !== filePath) {
        try {
          await deleteFile(oldFilePath);
          console.log(`🗑️ Deleted old ${field}:`, oldFilePath);
        } catch (error) {
          console.warn(`⚠️ Failed to delete old ${field}:`, error);
        }
      }
      setFormData(prev => {
        const newData = { ...prev, [field]: filePath };
        if (field === "audio" && !prev.audioTitle) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          newData.audioTitle = nameWithoutExt;
        }
        console.log(`🔹 Updated formData after ${field} upload:`, newData);
        return newData;
      });
      setOldFiles(prev => ({ ...prev, [field]: filePath }));
      setMessage(`✅ ${field} uploaded successfully!`);
      setTimeout(() => setMessage(""), 3000);
      e.target.value = ""; // Reset file input
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to upload ${field}`;
      console.error(`❌ Failed to upload ${field}:`, error);
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    const submitData: ProfileData = {
      ...formData,
      profileAvatar: formData.profileAvatar.trim(),
      background: formData.background.trim(),
      audio: formData.audio.trim(),
      audioImage: formData.audioImage.trim(),
      audioTitle: formData.audioTitle.trim(),
      customCursor: formData.customCursor.trim(),
      description: formData.description.trim(),
      username: formData.username.trim(),
      effectUsername: formData.effectUsername.trim(),
      location: formData.location.trim(),
    };
    console.log("🔄 Submitting profile:", submitData);
    try {
      await updateProfile("tuibingao", submitData);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      setMessage("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen w-full flex items-center justify-center">
    {/* Container nổi lên */}
    <div className="w-full max-w-5xl bg-transparent backdrop-blur-none rounded-2xl shadow-2xl overflow-y-auto max-h-screen">

      
      {/* Thông báo */}
      {message && (
        <div
          className={`text-center font-semibold text-lg mb-6 rounded-xl ${
            message.includes("success")
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Thông tin Profile */}
      <InformationProfile
        formData={formData}
        uploadingFiles={uploadingFiles}
        getMediaUrl={getMediaUrl}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
      />

      {/* Audio Profile */}
      <div className="mt-8">
        <AudioProfile
          formData={formData}
          uploadingFiles={uploadingFiles}
          getMediaUrl={getMediaUrl}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />
      </div>

      {/* Submit button */}
      <div className="mt-8 pt-6 border-t border-white/20">
        <button
          onClick={handleSubmit}
          disabled={loading || Object.values(uploadingFiles).some(Boolean)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Updating Profile...
            </div>
          ) : Object.values(uploadingFiles).some(Boolean) ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading Files...
            </div>
          ) : (
            "Update Profile"
          )}
        </button>
      </div>
    </div>
  </div>
);


};

export default ProfileForm;