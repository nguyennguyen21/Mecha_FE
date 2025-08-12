// src/services/authService.ts

import { API_CONFIG } from "../../../configs/ApiConfig";

// Interface cho dữ liệu đăng ký
interface RegisterData {
  username: string;
  email: string;
  phone: string;
  password: string;
}

// Hàm đăng ký người dùng
export const registerUser = async (userData: RegisterData): Promise<{ message: string }> => {
  const url = `${API_CONFIG.BASE_URL}/auth/register`;

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