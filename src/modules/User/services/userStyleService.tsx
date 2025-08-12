// src/services/userService.ts

const fetchUserProfile = async (username: string): Promise<UserProfile> => {
  // Lấy base URL không bao gồm /api
  const baseUrl = import.meta.env.VITE_API_BASE || `http://localhost:5159`;

  const url = `${baseUrl}/${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`User not found: ${username}`);
    }
    const data: UserProfile = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Định nghĩa kiểu dữ liệu trả về
interface UserProfile {
  styleId: string;
  profileAvatar: string;
  background: string;
  audio: string;
  customCursor: string;
  description: string;
  username: string;
  effectUsername: string;
  location: string;
}

export { fetchUserProfile };