import { useState, useEffect, useCallback } from "react";
import { type ProfileFormData, type FileState } from "../../../types";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';


export const useProfileData = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    profileAvatar: "",
    background: "",
    audio: "",
    audioImage: "",
    audioTitle: "",
    customCursor: "crosshair",
    description: "",
    username: "",
    displayName: "",
    effectUsername: "glow",
    location: "",
  });

  const [oldFiles, setOldFiles] = useState<FileState>({
    profileAvatar: "",
    background: "",
    audio: "",
    audioImage: "",
  });

  const [uploadingFiles, setUploadingFiles] = useState({
    profileAvatar: false,
    background: false,
    audio: false,
    audioImage: false,
  });

  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const getMediaUrl = useCallback((path: string): string => {
    if (!path || path.startsWith("blob:") || path.startsWith("http")) return path;
    return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
  }, []);

  const fetchProfile = useCallback(async () => {
      setIsProfileLoading(true);
      try {
        const userInfoString = localStorage.getItem("userInfo");
        if (!userInfoString) {
          throw new Error("You are not logged in.");
        }

        const userInfo = JSON.parse(userInfoString);
        const userIdFromStorage = userInfo.idUser || userInfo.id || userInfo.userId || userInfo.IdUser;

        if (!userIdFromStorage) {
          throw new Error("User ID not found in local storage.");
        }

        setUserId(userIdFromStorage);
        const token = localStorage.getItem("authToken") || "";

        const response = await fetch(`${API_BASE_URL}/api/profile/${userIdFromStorage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Handle 401 Unauthorized - token expired or invalid
          if (response.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userInfo");
            window.location.href = "/login";
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        const data = await response.json();

        const newFormData = {
          profileAvatar: data.profileAvatar ?? "",
          background: data.background ?? "",
          audio: data.audio ?? "",
          audioImage: data.audioImage ?? "",
          audioTitle: data.audioTitle ?? "",
          customCursor: data.customCursor ?? "crosshair",
          description: data.description ?? "",
          username: data.username ?? "",
          displayName: data.displayName ?? data.username ?? "", // Mặc định = username nếu không có
          effectUsername: data.effectUsername ?? "glow",
          location: data.location ?? "",
        };

        setFormData(newFormData);
        setOldFiles({
          profileAvatar: data.profileAvatar ?? "",
          background: data.background ?? "",
          audio: data.audio ?? "",
          audioImage: data.audioImage ?? "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsProfileLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  return {
    formData,
    setFormData,
    oldFiles,
    setOldFiles,
    uploadingFiles,
    setUploadingFiles,
    isProfileLoading,
    userId,
    getMediaUrl,
    handleChange,
    refetchProfile: fetchProfile,
  };
};