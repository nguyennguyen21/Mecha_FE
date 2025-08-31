import { useCallback } from "react";
import { type ProfileFormData, type FileState } from "../../../types";

const API_BASE_URL = "http://localhost:5159";

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
    formData.append("file", file);

    const url = new URL(`${API_BASE_URL}/api/FileUpload/upload`);
    url.searchParams.append("type", type);

    const response = await fetch(url.toString(), { method: "POST", body: formData });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  }, []);

  const deleteFile = useCallback(async (path: string) => {
    if (!path || path.startsWith("blob:") || path.startsWith("http")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/FileUpload/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Failed to delete file: ${path}`, error);
    }
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => {
      const file = e.target.files?.[0];
      if (!file) return;

      console.log(`🎵 Starting upload for ${field}:`, file.name);
      console.log(`📁 File details:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
      });

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"]; // Thêm hỗ trợ video
      const validAudioTypes = ["audio/mpeg", "audio/wav"];
      const maxSize = 10 * 1024 * 1024; // 10MB cho image và audio
      const maxVideoSize = 50 * 1024 * 1024; // 50MB cho video

      console.log(`🔍 Validation limits:`, {
        maxSize: maxSize / (1024 * 1024) + 'MB',
        maxVideoSize: maxVideoSize / (1024 * 1024) + 'MB',
        field: field,
        isVideo: validVideoTypes.includes(file.type),
        isImage: validImageTypes.includes(file.type),
        isAudio: validAudioTypes.includes(file.type)
      });

      // Validation cho từng loại file
      if (field === "audio" && !validAudioTypes.includes(file.type)) {
        console.log("❌ Audio validation failed: Invalid file type");
        setMessage("Invalid audio file type. Supported: MP3, WAV");
        return;
      }
      
      if (field === "background") {
        console.log("🖼️ Processing background file validation...");
        // Background hỗ trợ cả image và video
        if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
          console.log("❌ Background validation failed: Invalid file type");
          setMessage("Invalid background file type. Supported: JPG, PNG, GIF, MP4, WebM, OGG");
          return;
        }
        // Kiểm tra size cho video background
        if (validVideoTypes.includes(file.type) && file.size > maxVideoSize) {
          console.log("❌ Background video validation failed: Size exceeds 50MB", {
            fileSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
            limit: '50MB'
          });
          setMessage("Video file size exceeds 50MB.");
          return;
        }
        // Kiểm tra size cho image background
        if (validImageTypes.includes(file.type) && file.size > maxSize) {
          console.log("❌ Background image validation failed: Size exceeds 10MB", {
            fileSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
            limit: '10MB'
          });
          setMessage("Background image size exceeds 10MB.");
          return;
        }
        console.log("✅ Background validation passed!");
      } else {
        console.log(`📝 Processing ${field} file validation...`);
        // Kiểm tra cho các field khác (profileAvatar, audioImage, audio)
        if (["profileAvatar", "audioImage"].includes(field) && !validImageTypes.includes(file.type)) {
          console.log(`❌ ${field} validation failed: Invalid image type`);
          setMessage("Invalid image file type. Supported: JPG, PNG, GIF");
          return;
        }
        
        // Kiểm tra size cho image và audio (không phải background)
        if (file.size > maxSize) {
          console.log(`❌ ${field} validation failed: Size exceeds 10MB`, {
            fileSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
            limit: '10MB'
          });
          setMessage("File size exceeds 10MB.");
          return;
        }
        console.log(`✅ ${field} validation passed!`);
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

        console.log(`✅ Upload successful for ${field}:`, filePath);

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
            console.log(`🔄 Updated formData for ${field}:`, newData[field]);
            console.log("📋 Full new formData:", newData);

            // Update oldFiles synchronously
            setOldFiles((prevOld) => {
              const newOldFiles = { ...prevOld, [field]: filePath };
              console.log("📁 Updated oldFiles:", newOldFiles);
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
        console.error(`Upload ${field} error:`, error);
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