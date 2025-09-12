import { useCallback } from "react";
import { type ProfileFormData, type CustomStyles } from "../../../types";

const API_BASE_URL =  import.meta.env.VITE_BASE_URL || "http://localhost:5159";

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
  setMessage: (message: string) => void
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
      description: formData.description?.trim() || "",
      location: formData.location?.trim() || "",
      profileAvatar: formData.profileAvatar?.trim() || "",
      background: formData.background?.trim() || "",
      audio: formData.audio?.trim() || "",
      audioImage: formData.audioImage?.trim() || "",
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
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.message || `Profile update failed: ${response.status}`);
      }

      const responseData = await response.json();

      // Update styles
      try {
        await updateUserStyles(userId, customStyles);
      } catch (styleError) {
       throw new Error("Cannot update styles: " + styleError);
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 5000);

      // Cập nhật lại username trong localStorage nếu server trả về username mới
      if (responseData.newUsername) {
        const updatedUserInfo = { ...userInfo, username: responseData.newUsername };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      setMessage(errorMessage);
      console.error("Profile update error:", error);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  }, [formData, userId, customStyles, updateUserStyles, uploadingFiles, setLoading, setMessage]);

  return {
    handleSubmit,
  };
};
