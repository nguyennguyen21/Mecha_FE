import { useCallback } from "react";
import { type ProfileFormData, type CustomStyles } from "../../../types";

const API_BASE_URL = "http://localhost:5159";

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
    console.log("🔍 Starting submit process...");
    console.log("📋 Current formData at submit time:", formData);
    console.log("🎵 Audio path:", formData.audio);
    console.log("🖼️ Audio image path:", formData.audioImage);
    console.log("📝 Audio title:", formData.audioTitle);

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

    // Prevent submission if files are still uploading
    if (Object.values(uploadingFiles).some(Boolean)) {
      setMessage("Please wait until all files are uploaded.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setLoading(true);
    setMessage("");

    // Prepare submit data - ALWAYS include all fields, even empty ones
    const submitData: ProfileFormData = {
      username: formData.username.trim(),
      description: formData.description?.trim() || "",
      location: formData.location?.trim() || "",
      profileAvatar: formData.profileAvatar?.trim() || "",
      background: formData.background?.trim() || "",
      audio: formData.audio?.trim() || "", // Always include audio field
      audioImage: formData.audioImage?.trim() || "",
      audioTitle: formData.audioTitle?.trim() || "",
      customCursor: formData.customCursor?.trim() || "",
      effectUsername: formData.effectUsername?.trim() || ""
    };

    console.log("📤 Submit data being sent:", submitData);
    console.log("🎵 Audio in submit data:", submitData.audio);

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

      console.log("📨 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.message || `Profile update failed: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("✅ Success response:", responseData);

      // Update styles
      try {
        console.log("🎨 Custom styles being sent:", customStyles); 
        await updateUserStyles(userId, customStyles);
      } catch (styleError) {
        console.warn("⚠️ Failed to update styles:", styleError);
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
  }, [formData, userId, customStyles, updateUserStyles, uploadingFiles, setLoading, setMessage]);

  return {
    handleSubmit,
  };
};