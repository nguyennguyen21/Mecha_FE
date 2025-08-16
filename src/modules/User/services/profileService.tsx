// src/services/profileService.ts
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

export const updateProfile = async (
  username: string,
  data: ProfileData
): Promise<void> => {
  const url = `${API_CONFIG.BASE_URL}/profile/${username}`;

  const trimmedData = {
    ...data,
    ProfileAvatar: data.ProfileAvatar.trim(),
    Background: data.Background.trim(),
    Audio: data.Audio.trim(),
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trimmedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Profile updated successfully:', result);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};