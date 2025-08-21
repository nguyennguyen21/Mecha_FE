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

interface FileState {
  profileAvatar: string;
  background: string;
  audio: string;
  audioImage: string;
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

  const [oldFiles, setOldFiles] = useState<FileState>({
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

  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const getMediaUrl = (path: string): string => {
    if (!path || path.startsWith("blob:") || path.startsWith("http")) return path;
    return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsProfileLoading(true);
      try {
        const userInfoString = localStorage.getItem("userInfo");
        if (!userInfoString) {
          setMessage("You are not logged in.");
          return;
        }

        const userInfo = JSON.parse(userInfoString);
        console.log("UserInfo from localStorage:", userInfo); // Debug log
        const userIdFromStorage = userInfo.idUser || userInfo.id || userInfo.userId || userInfo.IdUser;
        console.log("Extracted userId:", userIdFromStorage); // Debug log
        
        if (!userIdFromStorage) {
          setMessage("User ID not found in local storage.");
          return;
        }

        setUserId(userIdFromStorage);
        const token = localStorage.getItem("authToken") || "";

        const response = await fetch(`${API_BASE_URL}/api/profile/${userIdFromStorage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch profile: ${response.status}`);
        const data = await response.json();

        setFormData({
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
        });

        setOldFiles({
          profileAvatar: data.profileAvatar ?? "",
          background: data.background ?? "",
          audio: data.audio ?? "",
          audioImage: data.audioImage ?? "",
        });

      } catch (error) {
        console.error(error);
        setMessage("Failed to load profile.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file: File, type: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const url = new URL(`${API_BASE_URL}/api/FileUpload/upload`);
    url.searchParams.append("type", type);

    const response = await fetch(url.toString(), { method: "POST", body: formData });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  };

  const deleteFile = async (path: string) => {
    if (!path || path.startsWith("blob:") || path.startsWith("http")) return;

    const response = await fetch(`${API_BASE_URL}/api/FileUpload/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Delete failed: ${response.status}`);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProfileFormData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const validAudioTypes = ["audio/mpeg", "audio/wav"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (field === "audio" && !validAudioTypes.includes(file.type)) {
      setMessage("Invalid audio file type.");
      return;
    }
    if (["profileAvatar", "background", "audioImage"].includes(field) && !validImageTypes.includes(file.type)) {
      setMessage("Invalid image file type.");
      return;
    }
    if (file.size > maxSize) {
      setMessage("File size exceeds 5MB.");
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [field]: true }));

    try {
      const fileType = field === "audio" ? "audio" : field === "audioImage" ? "audio_image" : "image";
      const filePath = await uploadFile(file, fileType);

      const oldFilePath = oldFiles[field as keyof FileState];
      if (oldFilePath && oldFilePath !== filePath) {
        await deleteFile(oldFilePath).catch((error) => console.warn(`Failed to delete old ${field}:`, error));
      }

      setFormData((prev) => {
        const newData = { ...prev, [field]: filePath };
        if (field === "audio" && !prev.audioTitle) {
          newData.audioTitle = file.name.replace(/\.[^/.]+$/, "");
        }
        return newData;
      });

      setOldFiles((prev) => ({ ...prev, [field]: filePath }));
      setMessage(`${field} uploaded successfully!`);
      setTimeout(() => setMessage(""), 3000);
      e.target.value = "";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Failed to upload ${field}.`);
      console.error(`Upload ${field} error:`, error);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      setMessage("Username is required.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    if (!userId) {
      setMessage("User ID not found.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setLoading(true);
    setMessage("");

    const submitData: Partial<ProfileFormData> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) {
        submitData[key as keyof ProfileFormData] = value.trim();
      }
    });

    try {
      console.log("Submitting data:", submitData);
      const token = localStorage.getItem("authToken") || "";

      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Profile update failed: ${response.status}`);
      }

      const responseData = await response.json();
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 5000);

      // Update local storage if username was changed
      if (responseData.newUsername) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        userInfo.username = responseData.newUsername;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      setMessage(errorMessage);
      console.error("Profile update error:", error);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 transition-all duration-500">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-y-auto max-h-screen">
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

        <InformationProfile
          formData={formData}
          uploadingFiles={uploadingFiles}
          getMediaUrl={getMediaUrl}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />

        <div className="mt-8 mx-4 sm:mx-8">
          <AudioProfile
            formData={formData}
            uploadingFiles={uploadingFiles}
            getMediaUrl={getMediaUrl}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
        </div>

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

        <div className="mx-4 sm:mx-8 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">🌈 Mood Board</h3>
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