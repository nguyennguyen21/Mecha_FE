import { type CustomStyles } from '../../../types/index';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5159';



// Default styles fallback
export const getDefaultStyles = (): CustomStyles => ({
  profileBorderWidth: "1px",
  profileBorderStyle: "solid",
  profileBorderColor: "#8b5cf6",
  profileBorderRadius: "16px",
  profilePadding: "16px",
  profileBackgroundColor: "#1f2937",
  profileOpacity: 1,
  profileBoxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",

  avatarBorderRadius: "50%",
  avatarShowBorder: false,
  avatarBorderWidth: "0px",
  avatarBorderStyle: "solid",
  avatarBorderColor: "#ffffff",

  usernameFontSize: "16px",
  usernameFontStyle: "normal",
  usernameFontWeight: "600",
  usernameColor: "#ffffff",
  usernameTextShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
  usernameTextTransform: "none",
  usernameLetterSpacing: "0px",

  locationFontSize: "14px",
  locationColor: "#9ca3af",
  locationFontStyle: "normal",

  cursorType: "pointer",
  cursorColor: "#ffffff",
  cursorFontSize: "12px",
  cursorFontWeight: "400",

  audioTitleFontSize: "16px",
  audioTitleFontWeight: "400",
  audioTitleColor: "#ffffff",
  audioTitleLetterSpacing: "0px",

  coverImageWidth: "45px",
  coverImageHeight: "45px",
  coverImageBorderRadius: "8px",
  coverImageBorderWidth: "0px",
  coverImageBorderStyle: "solid",
  coverImageBorderColor: "#ffffff",
  coverImageObjectFit: "cover",
  coverImageBoxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
});

// API service để fetch user styles
export const fetchUserStyles = async (userId: number): Promise<CustomStyles> => {
  try {
    const response = await fetch(`${BASE_URL}/api/UserStyles/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Giả sử API trả về dạng { idUser: number, styles: CustomStyles }
    return data.styles || {};
  } catch (error) {
    console.error('Error fetching user styles:', error);
    // Trả về default styles nếu có lỗi
    return getDefaultStyles();
  }
};