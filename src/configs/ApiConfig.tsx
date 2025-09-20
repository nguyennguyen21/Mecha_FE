// src/config/apiConfig.ts

const getApiUrl = (): string => {
  return import.meta.env.VITE_BASE_URL;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(), // → http://localhost:8000/api
};