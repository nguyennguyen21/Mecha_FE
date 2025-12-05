import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { type ProfileData, type UserStyle } from '../types/profile';
import { apiService } from '../services/api';

interface AudioPlayerProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

// Define the methods that can be called on the AudioPlayer ref
export interface AudioPlayerRef {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ profile, parsedStyles }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setCanAutoPlay] = useState(false);

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    play: async () => {
      const audio = audioRef.current;
      if (audio) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          setError('Playback failed');
        }
      }
    },
    pause: () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    },
    stop: () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    },
    setVolume: (vol: number) => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, vol));
        setVolumeState(audio.volume);
      }
    },
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
    isPlaying: () => isPlaying,
  }));

  if (!profile.audio) return null;

  // Helper function to get style with fallback to music player defaults
  const getStyle = (userValue: string | undefined, defaultValue: string) => {
    return userValue || defaultValue;
  };

  // Format time like in the original player
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Audio player container styles
  const audioContainerStyle: React.CSSProperties = {
    background: getStyle(parsedStyles?.audioBackgroundColor, 'rgba(255, 255, 255, 0.1)'),
    backdropFilter: 'blur(12px)',
    borderRadius: getStyle(parsedStyles?.audioBorderRadius, '16px'),
    border: parsedStyles?.audioBorderStyle && parsedStyles?.audioBorderWidth && parsedStyles?.audioBorderColor
      ? `${parsedStyles.audioBorderWidth} ${parsedStyles.audioBorderStyle} ${parsedStyles.audioBorderColor}`
      : getStyle(parsedStyles?.audioBorder, 'none'),
    width: getStyle(parsedStyles?.audioWidth, '400px'),
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    gap: '16px',
    boxShadow: getStyle(parsedStyles?.audioBoxShadow, '0 8px 32px rgba(0, 0, 0, 0.3)'),
    fontFamily: "'Inter', sans-serif",
    marginTop: '15px',
    position: 'relative',
    overflow: 'hidden',
  };

  // Loading overlay styles
  const loadingOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.875rem',
    backdropFilter: 'blur(2px)',
  };

  // Cover image styles
  const audioImageStyle: React.CSSProperties = {
    flexShrink: 0,
    width: getStyle(parsedStyles?.coverImageWidth, '64px'),
    height: getStyle(parsedStyles?.coverImageHeight, '64px'),
    borderRadius: getStyle(parsedStyles?.coverImageBorderRadius, '12px'),
    objectFit: (getStyle(parsedStyles?.coverImageObjectFit, 'cover') as any),
    border: parsedStyles?.coverImageBorderStyle && parsedStyles?.coverImageBorderWidth && parsedStyles?.coverImageBorderColor
      ? `${parsedStyles.coverImageBorderWidth} ${parsedStyles.coverImageBorderStyle} ${parsedStyles.coverImageBorderColor}`
      : 'none',
    boxShadow: getStyle(parsedStyles?.coverImageBoxShadow, 'none'),
    transition: 'transform 0.3s ease',
    transform: isPlaying ? 'scale(1.05)' : 'scale(1)',
  };

  // Info section styles
  const infoStyle: React.CSSProperties = {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0, // Ensure text truncation works
  };

  // Title styles
  const audioTitleStyle: React.CSSProperties = {
    fontSize: getStyle(parsedStyles?.audioTitleFontSize, '1.05rem'),
    fontWeight: getStyle(parsedStyles?.audioTitleFontWeight, '600'),
    color: getStyle(parsedStyles?.audioTitleColor, 'white'),
    letterSpacing: getStyle(parsedStyles?.audioTitleLetterSpacing, '0'),
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.2,
  };

  // Progress container styles
  const progressContainerStyle: React.CSSProperties = {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  // Time styles
  const timeStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    width: '34px',
    textAlign: 'center',
    color: getStyle(parsedStyles?.audioTimeColor, '#bfc7d5'),
    fontFamily: "'Inter', sans-serif",
    fontVariantNumeric: 'tabular-nums',
  };

  // Progress bar styles
  const progressBarStyle: React.CSSProperties = {
    flexGrow: 1,
    height: '6px',
    background: getStyle(parsedStyles?.audioProgressColor, 'rgba(255, 255, 255, 0.15)'),
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    transition: 'height 0.2s ease',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    background: getStyle(parsedStyles?.audioThumbColor, '#ffffff'),
    borderRadius: '3px',
    width: duration ? `${(currentTime / duration) * 100}%` : '0%',
    transition: 'width 0.1s ease',
    position: 'relative',
  };

  // Controls styles
  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  // Button styles
  const buttonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: getStyle(parsedStyles?.audioControlsColor, 'white'),
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    fontSize: '14px',
  };

  // Play button specific styles
  const playButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    width: '36px',
    height: '36px',
    background: getStyle(parsedStyles?.audioPlayButtonBackground, 'rgba(255, 255, 255, 0.1)'),
    backdropFilter: 'blur(8px)',
  };

  // Cover placeholder styles
  const coverPlaceholderStyle: React.CSSProperties = {
    flexShrink: 0,
    width: getStyle(parsedStyles?.coverImageWidth, '64px'),
    height: getStyle(parsedStyles?.coverImageHeight, '64px'),
    borderRadius: getStyle(parsedStyles?.coverImageBorderRadius, '12px'),
    background: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#bfc7d5',
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Enable auto-play after user interaction
    const enableAutoPlay = () => {
      setCanAutoPlay(true);
      audio.muted = false;
      setIsMuted(false);
      document.removeEventListener("click", enableAutoPlay);
      document.removeEventListener("scroll", enableAutoPlay);
      document.removeEventListener("touchstart", enableAutoPlay);
      document.removeEventListener("keydown", enableAutoPlay);
    };

    // Listen for various user interactions
    document.addEventListener("click", enableAutoPlay);
    document.addEventListener("scroll", enableAutoPlay);
    document.addEventListener("touchstart", enableAutoPlay);
    document.addEventListener("keydown", enableAutoPlay);

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Preload audio
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      document.removeEventListener("click", enableAutoPlay);
      document.removeEventListener("scroll", enableAutoPlay);
      document.removeEventListener("touchstart", enableAutoPlay);
      document.removeEventListener("keydown", enableAutoPlay);
    };
  }, [profile.audio]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (err) {
        setError('Playback failed');
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMutedState = !isMuted;
    audio.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  if (error) {
    return (
      <div style={{...audioContainerStyle, justifyContent: 'center', color: '#ff6b6b'}}>
        <span>Audio unavailable</span>
      </div>
    );
  }

  return (
    <div style={audioContainerStyle}>
      {isLoading && (
        <div style={loadingOverlayStyle}>
          Loading...
        </div>
      )}
      
      {/* Cover Image */}
      {profile.audioImage ? (
        <img
          src={apiService.getAssetUrl(profile.audioImage)}
          alt="Audio Cover"
          style={audioImageStyle}
        />
      ) : (
        <div style={coverPlaceholderStyle}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
      )}

      {/* Info Section */}
      <div style={infoStyle}>
        {/* Title */}
        <div style={audioTitleStyle} title={profile.audioTitle || 'Untitled Audio'}>
          {profile.audioTitle || 'Untitled Audio'}
        </div>

        {/* Progress Container */}
        <div style={progressContainerStyle}>
          <div style={timeStyle}>{formatTime(currentTime)}</div>
          
          <div 
            style={progressBarStyle} 
            onClick={handleProgressClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.height = '8px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.height = '6px';
            }}
          >
            <div style={progressFillStyle}></div>
          </div>
          
          <div style={timeStyle}>{formatTime(duration)}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={controlsStyle}>
        {/* Mute Button */}
        <button 
          style={buttonStyle} 
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {isMuted ? (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
        
        {/* Play/Pause Button */}
        <button
          style={playButtonStyle}
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={isLoading}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = getStyle(parsedStyles?.audioPlayButtonBackground, 'rgba(255, 255, 255, 0.2)');
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = getStyle(parsedStyles?.audioPlayButtonBackground, 'rgba(255, 255, 255, 0.1)');
          }}
        >
          {isPlaying ? (
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={apiService.getAssetUrl(profile.audio)}
        preload="auto"
        loop={true}
      />
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;