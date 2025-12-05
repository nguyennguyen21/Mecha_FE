// services/api.ts
import { type ProfileData, type UserStyleRaw } from '../types/profile';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

export const apiService = {
  async fetchProfile(username: string): Promise<ProfileData> {
    const res = await fetch(`${BASE_URL}/api/profile/username/${username}`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  },

  async fetchUserStyle(userId: number): Promise<UserStyleRaw> {
    const url = `${BASE_URL}/api/UserStyles/${userId}`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      await res.text(); // Consume response body
      throw new Error(`Failed to fetch style: ${res.status}`);
    }

    const data = await res.json();
    return data;
  },

  getAssetUrl(path: string): string {
    return `${BASE_URL}${path}`;
  }
};