import React, { useState, useEffect } from "react";
import InformationProfile from "./InformationProfile";
import AudioProfile from "./AudioProfile";
import AdvancedStyleSettings from "./AdvancedStyleSettings";
import QuickStylePresets from "./QuickStylePresets";
import { useUserStyles } from "./useUserStyles";
import { type ProfileFormData, type FileState, type CustomStyles } from "../../types"; // Add 'type' keyword

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

  const { loading: stylesLoading, error: stylesError, updateUserStyles } =
    useUserStyles();

const [customStyles, setCustomStyles] = useState<CustomStyles>({
  profileBorderStyle: "solid",
  profileBorderWidth: "1px",
  profileBorderColor: "rgba(139, 92, 246, 0.3)",
  profileBorderRadius: "16px",
  profilePadding: "24px",
  profileBackgroundColor: "rgba(31, 41, 55, 0.8)",
  profileOpacity: 1,
  profileBoxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  avatarBorderRadius: "50%",
  avatarShowBorder: true,
  avatarBorderStyle: "solid",
  avatarBorderWidth: "3px",
  avatarBorderColor: "rgba(139, 92, 246, 0.5)",
  usernameFontSize: "24px",
  usernameFontStyle: "normal",
  usernameFontWeight: "600",
  usernameColor: "#8b5cf6",
  usernameTextShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
  usernameTextTransform: "none",
  usernameLetterSpacing: "0.5px",
  locationFontSize: "14px",
  locationColor: "#9ca3af",
  locationFontStyle: "italic",
  cursorWidth: "20px",
  cursorHeight: "20px",
  cursorType: "crosshair",
  cursorColor: "#8b5cf6",
  cursorFontSize: "12px",
  cursorFontWeight: "500",
  audioTitleFontSize: "18px",
  audioTitleFontWeight: "500",
  audioTitleColor: "#ffffff",
  audioTitleLetterSpacing: "0.3px",
  coverImageWidth: "300px",
  coverImageHeight: "300px",
  coverImageBorderRadius: "12px",
  coverImageObjectFit: "cover",
  coverImageBorderStyle: "solid",
  coverImageBorderWidth: "2px",
  coverImageBorderColor: "rgba(139, 92, 246, 0.3)",
  coverImageBoxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

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
        const userIdFromStorage =
          userInfo.idUser || userInfo.id || userInfo.userId || userInfo.IdUser;

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

  const handleStyleChange = (styleKey: string, value: string | number | boolean) => {
    setCustomStyles((prev) => ({ ...prev, [styleKey]: value }));
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
    if (
      ["profileAvatar", "background", "audioImage"].includes(field) &&
      !validImageTypes.includes(file.type)
    ) {
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
        await deleteFile(oldFilePath).catch((error) =>
          console.warn(`Failed to delete old ${field}:`, error)
        );
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

      try {
        await updateUserStyles(userId, customStyles);
        console.log("User styles updated successfully");
      } catch (styleError) {
        console.warn("Failed to update styles:", styleError);
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 5000);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white transition-all duration-500">
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl overflow-y-auto max-h-screen p-6">
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

        {stylesError && (
          <div className="text-center text-yellow-300 bg-yellow-900/50 border border-yellow-700/50 rounded-xl p-4 mx-4 mb-6">
            Styles Error: {stylesError}
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

        <AdvancedStyleSettings
          customStyles={customStyles}
          handleStyleChange={handleStyleChange}
          stylesLoading={stylesLoading}
          userId={userId!} 
        />

        <QuickStylePresets
          customStyles={customStyles}
          setCustomStyles={setCustomStyles}
        />

        <div className="mt-8 mx-4 sm:mx-8 pb-8 pt-6 border-t border-gray-700/20">
          <button
            onClick={handleSubmit}
            disabled={loading || stylesLoading || Object.values(uploadingFiles).some(Boolean)}
            className="w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
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
            ) : stylesLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Loading Styles...
              </div>
            ) : (
              "🚀 Update Profile & Styles"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;