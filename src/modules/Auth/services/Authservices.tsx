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
    localStorage.setItem('userInfo', JSON.stringify(payload));
    console.log('Login successful:', payload);

    return payload as LoginResponse;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};


// modules/Auth/services/Authservices.ts
export interface DiscordLoginResponse {
  token: string;
  user: {
    idUser: number;
    username: string;
    email: string;
    phone: string;
    roles: string;
  };
}

export const discordLogin = async (): Promise<DiscordLoginResponse> => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/discordauth/callback`, {
    credentials: "include" 
  });
  if (!res.ok) throw new Error("Discord login failed");
  return res.json();
};