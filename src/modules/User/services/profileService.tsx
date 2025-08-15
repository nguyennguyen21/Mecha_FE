// src/api/profileApi.ts

import { API_CONFIG } from '../../../configs/ApiConfig';

interface ProfileData {
  ProfileAvatar: string;
  Background: string;
  Audio: string;
  CustomCursor: string;
  Description: string;
  Username: string;
  EffectUsername: string;
  Location: string;
}

/**
 * Cập nhật thông tin profile cho người dùng theo username
 * @param username Tên người dùng (ví dụ: 'tuibingao')
 * @param data Dữ liệu profile cần cập nhật
 */
export const updateProfile = async (
  username: string,
  data: ProfileData
): Promise<void> => {
  const url = `${API_CONFIG.BASE_URL}/profile/${username}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};
// Ví dụ sử dụng trong component hoặc file test

//ghi chu log ra coi ket qua
// import { updateProfile } from './api/profileApi';

// const profileData = {
//   ProfileAvatar: "https://example.com/avatar2.png",
//   Background: "https://example.com/bg2.jpg",
//   Audio: "https://example.com/audio2.mp3",
//   CustomCursor: "crosshair",
//   Description: "I am Alice",
//   Username: "perman",
//   EffectUsername: "glow",
//   Location: "Viet Nam"
// };

// // Gọi API để cập nhật profile cho username 'tuibingao'
// updateProfile('tuibingao', profileData)
//   .then(() => console.log('Success'))
//   .catch(err => console.error('Error:', err));