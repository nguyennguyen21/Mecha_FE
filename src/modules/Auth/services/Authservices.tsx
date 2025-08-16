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
}

interface LoginResponse {
  token: string;
  user: User;
}

// Hàm đăng nhập
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const url = `${API_CONFIG.BASE_URL}/api/auth/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};