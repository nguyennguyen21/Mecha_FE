// services/api.ts
import { type ProfileData, type UserStyleRaw } from '../types/profile';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiService = {
  async fetchProfile(username: string): Promise<ProfileData> {
    const res = await fetch(`http://testsv.shinelord.net:30052/api/profile/username/${username}`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  },

  async fetchUserStyle(userId: number): Promise<UserStyleRaw> {
    const url = `${BASE_URL}/api/UserStyles/${userId}`;
    console.log("📡 Making request to:", url);
    
    const res = await fetch(url);
    console.log("📥 Response status:", res.status);
    console.log("📥 Response ok:", res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.log("❌ Error response:", errorText);
      throw new Error(`Failed to fetch style: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ User style data:", data);
    return data;
  },

  getAssetUrl(path: string): string {
    return `${BASE_URL}${path}`;
  }
};