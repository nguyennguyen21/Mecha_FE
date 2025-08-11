// src/config/apiConfig.ts

const getApiUrl = (): string => {
  // Bạn có thể mở rộng để đọc từ .env sau
  const port = 5159;
  const baseUrl = import.meta.env.VITE_API_BASE || `http://localhost:${port}`;
  return `${baseUrl}/api`;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(), // → http://localhost:8000/api
};