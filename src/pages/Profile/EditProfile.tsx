import React, { useState, useEffect } from "react";
import InformationProfile from "./InformationProfile";
import AudioProfile from "./AudioProfile";

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

const API_BASE_URL = "http://localhost:5159";

const ProfileForm: React.FC = () => {
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

  const [uploadingFiles, setUploadingFiles] = useState({
    profileAvatar: false,
    background: false,
    audio: false,
    audioImage: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getMediaUrl = (path: string) => {
    if (!path) return "";
    const url = path.startsWith("blob:") || path.startsWith("http")
      ? path
      : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
    console.log(`🔹 Generated URL for path ${path}:`, url);
    return url;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/tuibingao`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("🔹 Raw profile data:", data);
        const profileData: ProfileFormData = {
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
      } catch (err) {
        console.error("❌ Get profile failed:", err);
        setMessage("❌ Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`🔹 Field ${name} updated:`, value);
  };

  const uploadFile = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.url;
  };

  const deleteFile = async (path: string) => {
    if (!path || path.startsWith("blob:") || path.startsWith("http")) return;
    const response = await fetch(`${API_BASE_URL}/api/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
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
    setUploadingFiles((prev) => ({ ...prev, [field]: true }));
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
      setFormData((prev) => {
        const newData = { ...prev, [field]: filePath };
        if (field === "audio" && !prev.audioTitle) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          newData.audioTitle = nameWithoutExt;
        }
        console.log(`🔹 Updated formData after ${field} upload:`, newData);
        return newData;
      });
      setOldFiles((prev) => ({ ...prev, [field]: filePath }));
      setMessage(`✅ ${field} uploaded successfully!`);
      setTimeout(() => setMessage(""), 3000);
      e.target.value = "";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to upload ${field}`;
      console.error(`❌ Failed to upload ${field}:`, error);
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    const submitData: Partial<ProfileFormData> = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof ProfileFormData];
      if (value.trim() !== "") {
        submitData[key as keyof ProfileFormData] = value.trim();
      }
    });
    console.log("🔄 Submitting profile:", submitData);
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/tuibingao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
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
    <div className="flex items-center justify-center min-h-screen bg-gray-950 transition-all duration-500">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-y-auto max-h-screen">
        {/* Message */}
        {message && (
          <div
            className={`text-center font-semibold text-lg mx-4 mb-6 rounded-xl p-4 transition-all duration-300 animate-bounce ${
              message.includes("success")
                ? "bg-green-900/50 text-green-300 border border-green-700/50 shadow-lg shadow-green-900/30"
                : "bg-red-900/50 text-red-300 border border-red-700/50 shadow-lg shadow-red-900/30"
            }`}
          >
            {message}
          </div>
        )}

        {/* Information Profile */}
        <InformationProfile
          formData={formData}
          uploadingFiles={uploadingFiles}
          getMediaUrl={getMediaUrl}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />

        {/* Audio Profile */}
        <div className="mt-8 mx-4 sm:mx-8">
          <AudioProfile
            formData={formData}
            uploadingFiles={uploadingFiles}
            getMediaUrl={getMediaUrl}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 mx-4 sm:mx-8 pb-8 pt-6 border-t border-gray-700/20">
          <button
            onClick={handleSubmit}
            disabled={loading || Object.values(uploadingFiles).some(Boolean)}
            className="w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white shadow-purple-500/25 hover:shadow-purple-500/40"
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

        {/* Theme Preview */}
            <div className="mx-4 sm:mx-8 mb-8">
  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
    <h3 className="text-lg font-semibold text-gray-200 mb-4">
      🌈 Mood Board
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 shadow-md"></div>
        <span className="text-xs text-gray-400">🔵 Main vibe</span>
      </div>
      <div className="text-center">
        <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-2 shadow-md"></div>
        <span className="text-xs text-gray-400">💜 Sidekick</span>
      </div>
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-600 rounded-lg mx-auto mb-2 shadow-md"></div>
        <span className="text-xs text-gray-400">🌌 Backdrop</span>
      </div>
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2 shadow-md"></div>
        <span className="text-xs text-gray-400">✍️ Words</span>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default ProfileForm;