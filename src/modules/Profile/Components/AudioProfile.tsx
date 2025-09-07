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
  userStyle?: {
    // Audio title styles
    audioTitleFontSize?: string;
    audioTitleFontWeight?: string;
    audioTitleColor?: string;
    audioTitleLetterSpacing?: string;
    // Cover image styles
    coverImageWidth?: string;
    coverImageHeight?: string;
    coverImageBorderRadius?: string;
    coverImageObjectFit?: string;
    coverImageBorderStyle?: string;
    coverImageBorderWidth?: string;
    coverImageBorderColor?: string;
    coverImageBoxShadow?: string;
    // Audio player styles
    audioHeight?: string;
    audioWidth?: string;
    audioBorderRadius?: string;
    audioBoxShadow?: string;
    audioBackgroundColor?: string;
    audioProgressColor?: string;
    audioThumbColor?: string;
    audioControlsColor?: string;
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
  userStyle = {},
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

  // Default styles matching the music player design - user styles take priority
  const getStyle = (property: string, defaultValue: string) => {
    return userStyle[property as keyof typeof userStyle] || defaultValue;
  };

  // Audio title styles (matching .title from HTML)
  const audioTitleStyles = {
    fontSize: getStyle('audioTitleFontSize', '1.05rem'),
    fontWeight: getStyle('audioTitleFontWeight', '600'),
    color: getStyle('audioTitleColor', 'white'),
    letterSpacing: getStyle('audioTitleLetterSpacing', '0'),
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // Cover image styles (matching .cover img)
  const coverImageStyles = {
    width: getStyle('coverImageWidth', '64px'),
    height: getStyle('coverImageHeight', '64px'),
    borderRadius: getStyle('coverImageBorderRadius', '12px'),
    objectFit: getStyle('coverImageObjectFit', 'cover') as 'cover' | 'contain' | 'fill' | 'none' | 'scale-down',
    borderStyle: getStyle('coverImageBorderStyle', 'none'),
    borderWidth: getStyle('coverImageBorderWidth', '0'),
    borderColor: getStyle('coverImageBorderColor', 'transparent'),
    boxShadow: getStyle('coverImageBoxShadow', ''),
  };

  // Audio player container styles (matching .player)
  const audioPlayerContainerStyles = {
    background: getStyle('audioBackgroundColor', 'rgba(255, 255, 255, 0.1)'),
    backdropFilter: 'blur(12px)',
    borderRadius: getStyle('audioBorderRadius', '16px'),
    width: getStyle('audioWidth', '400px'),
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    gap: '16px',
    boxShadow: getStyle('audioBoxShadow', '0 8px 32px rgba(0, 0, 0, 0.3)'),
  };

  // Generate CSS for custom audio player styling
  const audioCustomCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
    
    .music-player-container {
      font-family: 'Inter', sans-serif;
    }
    
      r {
      width: 100%;
      height: ${getStyle('audioHeight', '40px')};
      background: transparent;
      border: none;
      outline: none;
    }
    
    .custom-audio-player::-webkit-media-controls-panel {
      background: transparent;
      border-radius: ${getStyle('audioBorderRadius', '12px')};
    }
    
    .custom-audio-player::-webkit-media-controls-current-time-display,
    .custom-audio-player::-webkit-media-controls-time-remaining-display {
      color: ${getStyle('audioControlsColor', '#bfc7d5')};
      font-size: 0.75rem;
      font-family: 'Inter', sans-serif;
    }
    
    .custom-audio-player::-webkit-media-controls-timeline {
      background: ${getStyle('audioProgressColor', 'rgba(255, 255, 255, 0.15)')};
      border-radius: 3px;
      height: 5px;
    }
    
    .custom-audio-player::-webkit-media-controls-timeline::-webkit-slider-thumb {
      background: ${getStyle('audioThumbColor', '#ffffff')};
      border-radius: 50%;
      width: 12px;
      height: 12px;
      box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.8);
    }
    
    .custom-audio-player::-webkit-media-controls-play-button,
    .custom-audio-player::-webkit-media-controls-pause-button {
      background: transparent;
      color: ${getStyle('audioControlsColor', '#ffffff')};
      width: 28px;
      height: 28px;
    }
    
    .progress-time {
      font-size: 0.75rem;
      color: #bfc7d5;
      font-family: 'Inter', sans-serif;
      width: 34px;
      text-align: center;
    }
    
    .cover-placeholder {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bfc7d5;
    }
  `;

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
    
    if (audioImageInputRef.current) {
      audioImageInputRef.current.value = '';
    }
    setSelectedFiles(prev => ({ ...prev, audioImage: null }));
  };

  const getAudioFileName = () => {
    if (selectedFiles.audio) return selectedFiles.audio;
    if (formData.audio) {
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
      {/* Add custom CSS for music player styling */}
      <style>{audioCustomCSS}</style>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-pink-200 dark:from-blue-700 dark:to-pink-700 rounded-2xl flex items-center justify-center shadow-md">
          <svg
            className="w-6 h-6 text-blue-700 dark:text-blue-300 drop-shadow-sm"
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
              className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-xl transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 flex items-center justify-center"
              onClick={() => !uploadingFiles.audioImage && audioImageInputRef.current?.click()}
            >
              {formData.audioImage ? (
             <img
                src={
                  getMediaUrl(formData.audioImage) ||
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
                }
                alt="Audio Cover"
                // style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                className="transition-transform duration-500 group-hover:scale-105"
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
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
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
              style={{
                fontSize: getStyle('audioTitleFontSize', '1.05rem'),
                fontWeight: getStyle('audioTitleFontWeight', '600'),
                color: getStyle('audioTitleColor', ''),
                letterSpacing: getStyle('audioTitleLetterSpacing', '0'),
                fontFamily: "'Inter', sans-serif",
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-300/50 outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-white dark:bg-gray-800"
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
                  accept=".mp3,audio/mpeg"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-none file:bg-gradient-to-r file:from-blue-100 file:to-violet-100 dark:file:from-blue-800 dark:file:to-violet-800 file:text-blue-700 dark:file:text-blue-300 file:font-medium hover:file:from-blue-200 hover:file:to-violet-200 dark:hover:file:from-blue-700 dark:hover:file:to-violet-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-300/50 outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                  onChange={handleAudioFileChange}
                />
                {uploadingFiles.audio && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600"></div>
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

              {/* Music Player Preview - Design giống file HTML */}
              {formData.audio && (
                <div className="music-player-container">

                  {/* Alternative: Standard Audio Player */}
                  <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                    <audio
                      controls
                      className="w-full"
                      style={{
                        height: getStyle('audioHeight', '40px'),
                        borderRadius: getStyle('audioBorderRadius', '12px'),
                        boxShadow: getStyle('audioBoxShadow', '0 2px 4px rgba(0,0,0,0.1)'),
                      }}
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