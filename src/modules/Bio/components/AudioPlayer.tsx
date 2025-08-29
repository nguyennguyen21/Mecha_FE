// components/AudioPlayer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { type ProfileData, type UserStyle } from '../types/profile';
import { apiService } from '../services/api';

interface AudioPlayerProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ profile, parsedStyles }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!profile.audio) return null;

  // Helper function to get style with fallback to music player defaults
  const getStyle = (userValue: string | undefined, defaultValue: string) => {
    return userValue || defaultValue;
  };

  // Format time like in the original player
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Audio player container styles (matching .player from HTML)

// Audio player container styles (matching .player from HTML)
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
  };

  // Cover image styles (matching .cover img)
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
  };

  // Info section styles (matching .info)
  const infoStyle: React.CSSProperties = {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  // Title styles (matching .title)
  const audioTitleStyle: React.CSSProperties = {
    fontSize: getStyle(parsedStyles?.audioTitleFontSize, '1.05rem'),
    fontWeight: getStyle(parsedStyles?.audioTitleFontWeight, '600'),
    color: getStyle(parsedStyles?.audioTitleColor, 'white'),
    letterSpacing: getStyle(parsedStyles?.audioTitleLetterSpacing, '0'),
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // Artist styles (matching .artist)
  // const artistStyle: React.CSSProperties = {
  //   fontSize: '0.875rem',
  //   color: '#bfc7d5',
  //   marginTop: '2px',
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  // };

  // Progress container styles (matching .progress-container)
  const progressContainerStyle: React.CSSProperties = {
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  // Time styles (matching .time)
  const timeStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    width: '34px',
    textAlign: 'center',
    color: '#bfc7d5',
    fontFamily: "'Inter', sans-serif",
  };

  // Progress bar styles (matching .progress-bar)
  const progressBarStyle: React.CSSProperties = {
    flexGrow: 1,
    height: '5px',
    background: getStyle(parsedStyles?.audioProgressColor, 'rgba(255, 255, 255, 0.15)'),
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    background: getStyle(parsedStyles?.audioThumbColor, '#ffffff'),
    borderRadius: '3px',
    width: duration ? `${(currentTime / duration) * 100}%` : '0%',
    transition: 'width 0.1s ease',
  };

  // Controls styles (matching .controls)
  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  // Button styles (matching .btn)
  const buttonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: getStyle(parsedStyles?.audioControlsColor, 'white'),
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
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

  return (
    <div style={audioContainerStyle}>
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
        <div style={audioTitleStyle}>
          {profile.audioTitle || 'Untitled Audio'}
        </div>
        
        {/* Artist */}
        {/* <div style={artistStyle}>
          Unknown Artist
        </div> */}

        {/* Progress Container */}
        <div style={progressContainerStyle}>
          <div style={timeStyle}>{formatTime(currentTime)}</div>
          
          <div style={progressBarStyle} onClick={handleProgressClick}>
            <div style={progressFillStyle}></div>
          </div>
          
          <div style={timeStyle}>{formatTime(duration)}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={controlsStyle}>
        {/* Previous Button */}
        <button style={buttonStyle} title="Previous">
         <button id="prev"><i className="fas fa-step-backward"></i></button>
        </button>
        
        {/* Play/Pause Button */}
        <button style={buttonStyle} onClick={togglePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="4" height="12"/>
              <rect x="14" y="6" width="4" height="12"/>
            </svg>
          ) : (
           <button id="playPause"><i className="fas fa-play"></i></button>
          )}
        </button>
        
        {/* Next Button */}
        <button style={buttonStyle} title="Next">
          <button id="next"><i className="fas fa-step-forward"></i></button>
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={apiService.getAssetUrl(profile.audio)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioPlayer;