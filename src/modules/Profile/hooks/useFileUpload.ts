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

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const validAudioTypes = ["audio/mpeg", "audio/wav"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (field === "audio" && !validAudioTypes.includes(file.type)) {
        setMessage("Invalid audio file type.");
        return;
      }
      if (["profileAvatar", "background", "audioImage"].includes(field) && !validImageTypes.includes(file.type)) {
        setMessage("Invalid image file type.");
        return;
      }
      if (file.size > maxSize) {
        setMessage("File size exceeds 5MB.");
        return;
      }

      setUploadingFiles((prev) => ({ ...prev, [field]: true }));

      try {
        const fileType = field === "audio" ? "audio" : field === "audioImage" ? "audio_image" : "image";
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

        setMessage(`${field} uploaded successfully!`);
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