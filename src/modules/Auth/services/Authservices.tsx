// src/services/authService.ts

import { API_CONFIG } from "../../../configs/ApiConfig";

// src/services/authService.ts



// Interface cho dữ liệu đăng ký
interface RegisterData {
  username: string;
  email: string;
  // phone: string;
  password: string;
}

// Hàm đăng ký người dùng
export const Register = async (userData: RegisterData): Promise<{ message: string }> => {
  const url = `${API_CONFIG.BASE_URL}/api/auth/register`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }

    const data: { message: string } = await response.json();
    return data; // { message: "User registered successfully" }
  } catch (error: any) {
    // Xử lý lỗi 400 hoặc lỗi mạng
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// === Interface ===
interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  idUser: number;
  username: string;
  email: string;
  phone: string;
  roles: string;
  premium?: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/auth/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || 'Login failed');
    }

    // ✅ response ok => payload là dữ liệu user
    // Clear old cache before setting new user info
    localStorage.removeItem("userInfo");
    localStorage.removeItem("authToken");
    
    localStorage.setItem('userInfo', JSON.stringify(payload));
    if (payload.token) {
      localStorage.setItem('authToken', payload.token);
    }

    return payload as LoginResponse;
  } catch (error) {
    throw error;
  }
};