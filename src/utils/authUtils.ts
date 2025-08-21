// src/utils/authUtils.ts

export interface UserData {
  idUser: number;
  username: string;
  email: string;
  phone: string;
  roles: string;
}

// Lưu thông tin user sau khi login thành công
export const saveUserData = (userData: UserData, token: string) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userData", JSON.stringify(userData));
  localStorage.setItem("userId", userData.idUser.toString());
};

// Lấy toàn bộ thông tin user
export const getUserData = (): UserData | null => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

// Lấy chỉ userId
export const getUserId = (): number | null => {
  const userId = localStorage.getItem("userId");
  return userId ? parseInt(userId, 10) : null;
};

// Lấy username
export const getUsername = (): string | null => {
  const userData = getUserData();
  return userData ? userData.username : null;
};

// Lấy auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Xóa thông tin user khi logout
export const clearUserData = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("userId");
  localStorage.removeItem("authToken");
};

// Kiểm tra user có đang đăng nhập không
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const userData = getUserData();
  return !!(token && userData);
};

// Cập nhật username trong localStorage
export const updateStoredUsername = (newUsername: string) => {
  const userData = getUserData();
  if (userData) {
    userData.username = newUsername;
    localStorage.setItem("userData", JSON.stringify(userData));
  }
};