import { API_CONFIG } from "../../../configs/ApiConfig";

export interface ProfileData {
  profileAvatar: string;
  background: string;
  audio: string;
  customCursor: string;
  description: string;
  username: string;
  effectUsername: string;
  location: string;
}


// --- Upload File Function ---
export const uploadFile = async (
  file: File,
  type: "image" | "audio" = "image"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  // ✅ FIX: Thêm /api/ vào URL
  const url = `${API_CONFIG.BASE_URL}/api/FileUpload/upload?type=${type}`;
  
  console.log("🔍 Uploading to URL:", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    console.log("📤 Upload response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Upload error response:", errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Upload successful:", result);
    return result.filePath; // Trả về đường dẫn file
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    throw error;
  }
};

// --- Delete File Function ---
export const deleteFile = async (filePath: string): Promise<void> => {
  // ✅ FIX: Thêm /api/ vào URL
  const url = `${API_CONFIG.BASE_URL}/api/FileUpload/delete?filePath=${encodeURIComponent(filePath)}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${response.status} - ${errorText}`);
    }

    console.log("✅ File deleted:", filePath);
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    throw error;
  }
};

// --- GET Profile ---
export const getProfile = async (
  username: string
): Promise<ProfileData | null> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile/${username}`;

  try {
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      if (response.status === 404) return null; 
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    return result as ProfileData;
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return null;
  }
};

// --- POST Update Profile ---
export const updateProfile = async (
  username: string,
  data: ProfileData
): Promise<void> => {
  const url = `${API_CONFIG.BASE_URL}/api/profile/${username}`;

  const trimmedData = {
    ...data,
    profileAvatar: data.profileAvatar?.trim?.() ?? "",
    background: data.background?.trim?.() ?? "",
    audio: data.audio?.trim?.() ?? "",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trimmedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ Profile updated successfully:", result);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
};