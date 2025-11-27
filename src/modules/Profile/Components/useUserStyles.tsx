import { useState } from 'react';

// Types
export interface UserStyleDto {
  idUser: number;
  styles: Record<string, any>;
}

export interface UserStylesHook {
  loading: boolean;
  error: string | null;
  updateUserStyles: (idUser: number, styles: Record<string, any>) => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5159';

// Service class for PUT API call only
export class UserStylesService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("authToken") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // PUT: api/UserStyles/{idUser}
  static async updateUserStyle(idUser: number, styles: Record<string, any>): Promise<any> {
    const dto: UserStyleDto = { idUser, styles };

    const response = await fetch(`${API_BASE_URL}/api/UserStyles/${idUser}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update user styles: ${response.status}`);
    }

    return await response.json();
  }
}

// Custom Hook for updating UserStyles only
export const useUserStyles = (): UserStylesHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserStyles = async (idUser: number, styles: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      await UserStylesService.updateUserStyle(idUser, styles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update user styles";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateUserStyles,
  };
};