import { useCallback } from "react";
import { type ProfileFormData, type FileState } from "../../../types";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

export const useFileUpload = (
  oldFiles: FileState,
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>,
  setOldFiles: React.Dispatch<React.SetStateAction<FileState>>,
  setUploadingFiles: React.Dispatch<React.SetStateAction<{
    profileAvatar: boolean;
    background: boolean;
    audio: boolean;
    audioImage: boolean;
  }>>,
  setMessage: (message: string) => void
) => {
  const uploadFile = useCallback(async (file: File, type: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const url = new URL(`${API_BASE_URL}/api/FileUpload/upload`);
  url.searchParams.append('type', type);

  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = user.idUser || user.IdUser;
  if (userId) url.searchParams.append('userId', userId);

  const token = user.token || user.accessToken;

  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.url;
}, []);


  const deleteFile = useCallback(async (path: string) => {
    if (!path || path.startsWith("blob:") || path.startsWith("http")) return;

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/FileUpload/delete`, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Delete failed: ${response.status}`);
      }
    } catch (error) {
      // Silent fail for file deletion
    }
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      const validAudioTypes = ["audio/mpeg", "audio/wav"];
      const maxSize = 10 * 1024 * 1024; // 10MB cho image và audio
      const maxVideoSize = 50 * 1024 * 1024; // 50MB cho video

      // FIX: Kiểm tra premium status trước khi upload video
      if (field === "background" && validVideoTypes.includes(file.type)) {
        const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
        // Check Premium - handle both boolean and number (1/0) from database
        const isPremium = !!(user?.Premium === true || user?.Premium === 1 || 
                            user?.premium === true || user?.premium === 1);
        
        if (!isPremium) {
          setMessage("Premium subscription required for video background upload!");
          return;
        }
      }

      // Validation cho từng loại file
      if (field === "audio" && !validAudioTypes.includes(file.type)) {
        setMessage("Invalid audio file type. Supported: MP3, WAV");
        return;
      }
      
      if (field === "background") {
        // Background hỗ trợ cả image và video
        if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
          setMessage("Invalid background file type. Supported: JPG, PNG, GIF, MP4, WebM, OGG");
          return;
        }
        // Kiểm tra size cho video background
        if (validVideoTypes.includes(file.type) && file.size > maxVideoSize) {
          setMessage("Video file size exceeds 50MB.");
          return;
        }
        // Kiểm tra size cho image background
        if (validImageTypes.includes(file.type) && file.size > maxSize) {
          setMessage("Background image size exceeds 10MB.");
          return;
        }
      } else {
        // Kiểm tra cho các field khác (profileAvatar, audioImage, audio)
        if (["profileAvatar", "audioImage"].includes(field) && !validImageTypes.includes(file.type)) {
          setMessage("Invalid image file type. Supported: JPG, PNG, GIF");
          return;
        }
        
        // Kiểm tra size cho image và audio (không phải background)
        if (file.size > maxSize) {
          setMessage("File size exceeds 10MB.");
          return;
        }
      }

      setUploadingFiles((prev) => ({ ...prev, [field]: true }));

      try {
        let fileType: string;
        
        // Xác định loại file để upload
        if (field === "audio") {
          fileType = "audio";
        } else if (field === "audioImage") {
          fileType = "audio_image";
        } else if (field === "background") {
          // Phân biệt background image và video
          if (validVideoTypes.includes(file.type)) {
            fileType = "background_video";
          } else {
            fileType = "background_image";
          }
        } else {
          fileType = "image";
        }

        const filePath = await uploadFile(file, fileType);

        // Delete old file if it exists and is different
        const oldFilePath = oldFiles[field as keyof FileState];
        if (oldFilePath && oldFilePath !== filePath) {
          await deleteFile(oldFilePath);
        }

        // Update formData and oldFiles atomically
        await new Promise((resolve) => {
          setFormData((prev) => {
            const newData = {
              ...prev,
              [field]: filePath,
              ...(field === "audio" && !prev.audioTitle && { audioTitle: file.name.replace(/\.[^/.]+$/, "") }),
            };

            // Update oldFiles synchronously
            setOldFiles((prevOld) => {
              const newOldFiles = { ...prevOld, [field]: filePath };
              resolve(null); // Resolve the promise after both states are updated
              return newOldFiles;
            });

            return newData;
          });
        });

        // Thông báo thành công với loại file cụ thể
        const fileTypeMsg = validVideoTypes.includes(file.type) ? "video" : 
                           validAudioTypes.includes(file.type) ? "audio" : "image";
        setMessage(`${field} ${fileTypeMsg} uploaded successfully!`);
        setTimeout(() => setMessage(""), 3000);
        e.target.value = "";
      } catch (error) {
        setMessage(error instanceof Error ? error.message : `Failed to upload ${field}.`);
        setTimeout(() => setMessage(""), 5000);
      } finally {
        setUploadingFiles((prev) => ({ ...prev, [field]: false }));
      }
    },
    [oldFiles, uploadFile, deleteFile, setFormData, setOldFiles, setUploadingFiles, setMessage]
  );

  return {
    handleFileChange,
  };
};