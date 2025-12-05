// src/config/apiConfig.ts

const getApiUrl = (): string => {
  // Lấy từ env, mặc định là localhost:30052 (backend port)
  return import.meta.env.VITE_BASE_URL || 'http://localhost:30052';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
};