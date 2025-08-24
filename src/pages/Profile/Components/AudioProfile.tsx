import React, { useRef, useState } from "react";

interface AudioProfileProps {
  formData: {
    audio: string;
    audioImage: string;
    audioTitle: string;
  };
  uploadingFiles: {
    audio: boolean;
    audioImage: boolean;
  };
  getMediaUrl: (path: string) => string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "audio" | "audioImage"
  ) => void;
}

const AudioProfile: React.FC<AudioProfileProps> = ({
  formData,
  uploadingFiles,
  getMediaUrl,
  handleChange,
  handleFileChange,
}) => {
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const audioImageInputRef = useRef<HTMLInputElement | null>(null);
  
  // Track selected file names
  const [selectedFiles, setSelectedFiles] = useState<{
    audio: string | null;
    audioImage: string | null;
  }>({
    audio: null,
    audioImage: null,
  });

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, audio: file.name }));
    }
    handleFileChange(e, "audio");
  };

  const handleAudioImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, audioImage: file.name }));
    }
    handleFileChange(e, "audioImage");
  };

  const clearAudio = () => {
    const event = {
      target: { name: 'audio', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
    
    // Clear file input and selected file name
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
    setSelectedFiles(prev => ({ ...prev, audio: null }));
  };

  const clearAudioImage = () => {
    const event = {
      target: { name: 'audioImage', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
    
    // Clear file input and selected file name
    if (audioImageInputRef.current) {
      audioImageInputRef.current.value = '';
    }
    setSelectedFiles(prev => ({ ...prev, audioImage: null }));
  };

  // Get display name for files
  const getAudioFileName = () => {
    if (selectedFiles.audio) return selectedFiles.audio;
    if (formData.audio) {
      // Extract filename from path
      const parts = formData.audio.split('/');
      return parts[parts.length - 1] || 'Current audio file';
    }
    return null;
  };

  const getAudioImageFileName = () => {
    if (selectedFiles.audioImage) return selectedFiles.audioImage;
    if (formData.audioImage) {
      const parts = formData.audioImage.split('/');
      return parts[parts.length - 1] || 'Current image file';
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 rounded-2xl flex items-center justify-center shadow-md">
          <svg
            className="w-6 h-6 text-purple-700 dark:text-purple-300 drop-shadow-sm"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
          Audio Profile
        </h2>
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Cover Image Section */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-tight">
            Cover Image
          </label>
          <div className="relative group cursor-pointer">
            <div
              className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:shadow-xl transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 flex items-center justify-center"
              onClick={() => !uploadingFiles.audioImage && audioImageInputRef.current?.click()}
            >
              {formData.audioImage ? (
                <img
                  src={getMediaUrl(formData.audioImage) || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"}
                  alt="Audio Cover"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center text-gray-400 dark:text-gray-500 space-y-3">
                  <svg
                    className="w-12 h-12 mx-auto opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm font-medium tracking-wide">Upload Cover Image</p>
                </div>
              )}
            </div>
            {uploadingFiles.audioImage && (
              <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center animate-pulse">
                <div className="flex flex-col items-center text-white">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
                  <p className="text-sm mt-3 font-medium opacity-90">Uploading Cover...</p>
                </div>
              </div>
            )}
            <input
              ref={audioImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAudioImageFileChange}
            />
          </div>

          {/* Show selected/current image file name */}
          {getAudioImageFileName() && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {getAudioImageFileName()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearAudioImage}
                  className="ml-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-md transition-colors duration-200 flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio Title & File Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-tight">
              Audio Title
            </label>
            <input
              type="text"
              name="audioTitle"
              value={formData.audioTitle}
              onChange={handleChange}
              placeholder="Enter audio title..."
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-300/50 outline-none transition-all duration-200 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-tight">
              Audio File
            </label>
            <div className="space-y-4">
              <div className="relative">
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-none file:bg-gradient-to-r file:from-purple-100 file:to-violet-100 dark:file:from-purple-800 dark:file:to-violet-800 file:text-purple-700 dark:file:text-purple-300 file:font-medium hover:file:from-purple-200 hover:file:to-violet-200 dark:hover:file:from-purple-700 dark:hover:file:to-violet-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-300/50 outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onChange={handleAudioFileChange}
                />
                {uploadingFiles.audio && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-600"></div>
                  </div>
                )}
              </div>

              {/* Show selected/current audio file name */}
              {getAudioFileName() && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {getAudioFileName()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={clearAudio}
                      className="ml-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-md transition-colors duration-200 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Current Audio Display */}
              {formData.audio && (
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/50 rounded-2xl p-5 shadow-inner border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audio Preview</span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                    <audio
                      controls
                      className="w-full"
                      style={{ height: "40px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    >
                      <source src={getMediaUrl(formData.audio)} type="audio/mpeg" />
                      <source src={getMediaUrl(formData.audio)} type="audio/wav" />
                      <source src={getMediaUrl(formData.audio)} type="audio/mp3" />
                      <source src={getMediaUrl(formData.audio)} type="audio/ogg" />
                      <p className="text-gray-500 text-sm text-center py-2">
                        Your browser does not support the audio element.
                      </p>
                    </audio>
                  </div>
                  
                  {/* Audio Info */}
                  {formData.audioTitle && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Title:</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {formData.audioTitle}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* No Audio State */}
              {!formData.audio && !uploadingFiles.audio && !getAudioFileName() && (
                <div className="text-center py-6 text-gray-400 dark:text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                  <p className="text-sm">No audio file selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioProfile;