import { API_CONFIG } from '../../../configs/ApiConfig';

export interface UserProfile {
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

const getUserProfile = async (username: string): Promise<UserProfile> => {
  const url = `${API_CONFIG.BASE_URL}/${username}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Không tìm thấy người dùng');
    }

    const  UserProfile = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    throw error;
  }
};

export default getUserProfile;