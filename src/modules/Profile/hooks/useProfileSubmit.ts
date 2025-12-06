import { useCallback } from "react";
import { type ProfileFormData, type CustomStyles } from "../../../types";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

export const useProfileSubmit = (
  formData: ProfileFormData,
  userId: number | null,
  customStyles: CustomStyles,
  uploadingFiles: {
    profileAvatar: boolean;
    background: boolean;
    audio: boolean;
    audioImage: boolean;
  },
  updateUserStyles: (userId: number, styles: CustomStyles) => Promise<void>,
  setLoading: (loading: boolean) => void,
  setMessage: (message: string) => void,
  refetchProfile?: () => Promise<void>
) => {
  const handleSubmit = useCallback(async () => {

    if (!userId) {
      setMessage("User ID not found.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    // Prevent submission if files are still uploading
    if (Object.values(uploadingFiles).some(Boolean)) {
      setMessage("Please wait until all files are uploaded.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setLoading(true);
    setMessage("");

    // Get current username từ localStorage (nếu trống)
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const currentUsername = userInfo.username || "";

    // Prepare submit data
    const submitData: ProfileFormData = {
      username: formData.username.trim() || currentUsername, // giữ tên cũ nếu không nhập
      displayName: formData.displayName?.trim() || formData.username.trim() || currentUsername, // Mặc định = username nếu không có
      description: formData.description?.trim() || "",
      location: formData.location?.trim() || "",
      profileAvatar: formData.profileAvatar?.trim() || "",
      background: formData.background?.trim() || "",
      audio: (formData.audio && formData.audio.trim()) || "",
      audioImage: (formData.audioImage && formData.audioImage.trim()) || "",
      audioTitle: formData.audioTitle?.trim() || "",
      customCursor: formData.customCursor?.trim() || "",
      effectUsername: formData.effectUsername?.trim() || ""
    };


    try {
      const token = localStorage.getItem("authToken") || "";
      const requestUrl = `${API_BASE_URL}/api/profile/${userId}`;

      const response = await fetch(requestUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Profile update failed: ${response.status}`);
      }

      const responseData = await response.json();

      // Update styles - ensure all styles including locationColor are saved
      try {
        // Ensure locationColor is included in styles
        const stylesToSave = { ...customStyles };
        if (!stylesToSave.locationColor) {
          stylesToSave.locationColor = "#9ca3af"; // Default if missing
        }
        await updateUserStyles(userId, stylesToSave);
      } catch (styleError: any) {
        const errorMsg = styleError instanceof Error ? styleError.message : String(styleError);
        throw new Error("Cannot update styles: " + errorMsg);
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 5000);

      // Cập nhật lại username trong localStorage nếu server trả về username mới
      if (responseData.newUsername) {
        const updatedUserInfo = { ...userInfo, username: responseData.newUsername };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      }

      // Reload profile data from server to show updated audio
      if (refetchProfile) {
        try {
          await refetchProfile();
        } catch (error) {
          console.error("Failed to reload profile data:", error);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      setMessage(errorMessage);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  }, [formData, userId, customStyles, updateUserStyles, uploadingFiles, setLoading, setMessage, refetchProfile]);

  return {
    handleSubmit,
  };
};
