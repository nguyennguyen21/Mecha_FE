import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfileBackground from "./components/ProfileBackground";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileUsername from "./components/ProfileUsername";
import ProfileLocation from "./components/ProfileLocation";
import AudioPlayer from "./components/AudioPlayer";
import Loading from "./components/Loading";
import ProfileDescription from "./components/ProfileDescription";
import SocialLinks from "./components/SocialLinks";
import { type AudioPlayerRef } from "./components/AudioPlayer";
import { useProfileData } from "./hooks/useProfileData";
import { useUserStyle } from "./hooks/useUserStyle";
import { useCustomCursor } from "./hooks/useCustomCursor";
import { useUserEffects } from "./hooks/useUserEffects";
import { createContainerStyle, subContainer, getContainerBackground } from "./utils/styleUtils";
import EffectRenderer from "../Effects/EffectRenderer";
import CSSFireworks from "./components/CSSFireworks";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [entered, setEntered] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [elementsVisible, setElementsVisible] = useState({
    avatar: false,
    username: false,
    description: false,
    socialLinks: false,
    location: false,
    audio: false,
  });

  const audioRef = useRef<AudioPlayerRef>(null);
  const { profile, loading, error } = useProfileData(username);
  const { parsedStyles } = useUserStyle(profile?.userId, profile?.username ?? "Guest");
  const { appliedEffect } = useUserEffects(profile?.userId);

  // Don't hide cursor on mount - let useCustomCursor handle it based on parsedStyles
  // useEffect removed - cursor handling is now done in useCustomCursor hook

  // Initialize custom cursor (will update when parsedStyles are available)
  useCustomCursor(parsedStyles);
  

  useEffect(() => {
    if (profile?.background) {
      const img = new Image();
      img.src = profile.background;
    }
  }, [profile?.background]);

  const handleEnter = () => {
    if (audioRef.current && profile?.audio) {
      audioRef.current.play().catch(console.error);
    }
    setEntered(true);
    setShowProfile(true);
  };

  useEffect(() => {
    if (showProfile && profile) {
      const sequence = [
        { key: "avatar", delay: 0 },
        { key: "username", delay: 200 },
        { key: "description", delay: 400 },
        { key: "socialLinks", delay: 600 },
        { key: "location", delay: 800 },
        { key: "audio", delay: 1000 },
      ];
      sequence.forEach(({ key, delay }) => {
        setTimeout(() => {
          setElementsVisible((prev) => ({ ...prev, [key]: true }));
        }, delay);
      });
    }
  }, [showProfile, profile]);

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <div className="flex justify-center items-center min-h-screen text-white">Error: {error}</div>;
  if (!profile) return <div className="flex justify-center items-center min-h-screen text-white">Profile not found</div>;

  const containerStyle = createContainerStyle(parsedStyles);
  const subContainerStyle = subContainer(parsedStyles, profile);
  const { backgroundColor, opacity } = getContainerBackground(parsedStyles);

  // Check if layout is left-aligned
  const isLeftAligned = parsedStyles?.containerAlignItems === 'flex-start' && parsedStyles?.containerTextAlign === 'left';

  const getAnimationStyle = (isVisible: boolean, hasEffectAnimation = false) => {
    // If there's an effect animation, only control opacity to avoid conflicts
    if (hasEffectAnimation) {
      return {
        opacity: isVisible ? 1 : 0,
        // Don't add transition or transform to avoid conflicts with effect animations
      };
    }
    
    // Normal animation style for elements without effects
    return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0px)" : "translateY(20px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  // Get effect styles for username - Prismic CSS Text Animations + Colorful + Particles
  const getEffectStyles = (effect: any) => {
    if (!effect?.product) {
      console.log('⚠️ No effect product found');
      return { styles: {}, effectData: null };
    }
    
    const category = effect.product.category || effect.product.type;
    const name = (effect.product.name || '').toLowerCase();
    let effectType = null;
    let effectData = null;
    
    try {
      if (effect.product.effectData) {
        effectData = JSON.parse(effect.product.effectData);
        effectType = effectData?.type;
      }
    } catch (e) {
      console.error('Failed to parse effectData:', e);
    }
    
    console.log('🎨 Applying effect:', { name, category, effectType, effectData, product: effect.product });
    
    const styles: any = {};
    
    // If it's a particle effect or matrix rain, don't apply text styles, just return effectData
    if (category === 'particle' || name.includes('particle') || 
        effectType?.includes('particle') || effectType === 'sparkle' ||
        effectType === 'sparkle-particles' || effectType === 'star-field' ||
        effectType === 'floating-hearts' || effectType === 'hearts' ||
        effectType === 'fireflies' || effectType === 'bubbles' ||
        effectType === 'confetti' || effectType === 'snowflakes' ||
        effectType === 'snow' || effectType === 'dust-particles' ||
        effectType === 'dust' || effectType === 'energy-orbs' ||
        effectType === 'floating-notes' || effectType === 'rainbow-dots' ||
        effectType === 'glowing-rings' || effectType === 'magic-sparkles' ||
        effectType === 'floating-emojis' || effectType === 'colorful-dots' ||
        effectType === 'fireworks' ||
        effectType === 'matrix' || effectType === 'matrix-rain' || name.includes('matrix') || name.includes('rain')) {
      console.log('✨ Particle/Matrix effect - returning effectData only');
      return { styles: {}, effectData };
    }
    
    // Match by effectType first (most reliable)
    if (effectType) {
      console.log('🔍 Matching effectType:', effectType);
      switch (effectType) {
        case 'neon-glow':
          console.log('✅ Matched: neon-glow');
          styles.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4)';
          styles.animation = 'neonGlow 3s ease-in-out infinite';
          break;
        case 'rainbow-gradient':
          console.log('✅ Matched: rainbow-gradient');
          styles.background = 'linear-gradient(45deg, #f0f, #0ff, #ff0, #f0f)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'rainbowGradient 3s ease infinite';
          break;
        case 'pulse':
          console.log('✅ Matched: pulse');
          styles.animation = 'pulseText 2s ease-in-out infinite';
          styles.transformOrigin = 'center';
          // Ensure transform is not overridden
          styles.willChange = 'transform';
          break;
        case 'dancing-shadow':
          styles.textShadow = '5px 5px 0px rgba(255, 107, 107, 0.8), -5px -5px 0px rgba(78, 205, 196, 0.8)';
          styles.animation = 'dancingShadow 2s ease-in-out infinite alternate';
          break;
        case 'glitch':
          styles.animation = 'glitchText 0.3s infinite';
          styles.position = 'relative';
          break;
        case '3d-spin':
          styles.textShadow = '2px 2px 0px rgba(255, 0, 0, 0.8), 4px 4px 0px rgba(0, 255, 0, 0.6), 6px 6px 0px rgba(0, 0, 255, 0.4)';
          styles.animation = 'spin3D 4s linear infinite';
          styles.transformStyle = 'preserve-3d';
          break;
        case 'wavy':
          styles.animation = 'wavyText 2s ease-in-out infinite';
          break;
        case 'text-masking':
        case 'shimmer':
          styles.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)';
          styles.backgroundSize = '200% 100%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'shimmerText 2s infinite';
          break;
        case 'split-text':
          styles.animation = 'splitText 1s ease-out forwards';
          break;
        case 'melting':
          styles.animation = 'meltingText 3s ease-in-out infinite';
          styles.position = 'relative';
          break;
        case 'explosive-burst':
          styles.animation = 'explosiveBurst 1s ease-out';
          styles.position = 'relative';
          break;
        case 'holographic':
          styles.background = 'linear-gradient(45deg, #FF006E, #8338EC, #3A86FF, #FF006E)';
          styles.backgroundSize = '400% 400%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'holographicText 4s ease infinite';
          break;
        case 'aurora':
          styles.background = 'linear-gradient(45deg, #00FF88, #00D4FF, #8B00FF)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'auroraText 5s ease infinite';
          break;
        case 'typewriter':
          styles.animation = 'typewriterText 3s steps(40) infinite';
          styles.borderRight = '2px solid';
          styles.whiteSpace = 'nowrap';
          styles.overflow = 'hidden';
          break;
        case 'glowing-3d':
          styles.textShadow = '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)';
          styles.animation = 'glowing3D 3s ease-in-out infinite';
          styles.transformStyle = 'preserve-3d';
          break;
        case 'shadow-animation':
          styles.textShadow = '2px 2px 0px rgba(255, 107, 107, 0.8), 4px 4px 0px rgba(78, 205, 196, 0.6), 6px 6px 0px rgba(69, 183, 209, 0.4)';
          styles.animation = 'shadowAnimation 2s ease-in-out infinite alternate';
          break;
        case 'rainbow-spotlight':
          styles.background = 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)';
          styles.backgroundSize = '200% 100%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'rainbowSpotlight 3s linear infinite';
          break;
        // Colorful gradients
        case 'fire-gradient':
          styles.background = 'linear-gradient(45deg, #FF4500, #FF6347, #FFD700)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'fireGradient 2s ease infinite';
          break;
        case 'ocean-wave':
          styles.background = 'linear-gradient(45deg, #00CED1, #1E90FF, #4169E1)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'oceanWave 3s ease infinite';
          break;
        case 'sunset-glow':
          styles.background = 'linear-gradient(45deg, #FF6347, #FF69B4, #FF1493)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'sunsetGlow 4s ease infinite';
          break;
        case 'electric-blue':
          styles.textShadow = '0 0 10px rgba(0, 191, 255, 0.8), 0 0 20px rgba(0, 191, 255, 0.6), 0 0 30px rgba(0, 191, 255, 0.4)';
          styles.animation = 'electricBlue 2s ease-in-out infinite';
          break;
        case 'purple-dream':
          styles.background = 'linear-gradient(45deg, #9370DB, #BA55D3, #DA70D6)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'purpleDream 3s ease infinite';
          break;
        case 'golden-shine':
          styles.background = 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)';
          styles.backgroundSize = '200% 100%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'goldenShine 2s linear infinite';
          break;
        case 'cyan-pulse':
          styles.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6)';
          styles.animation = 'cyanPulse 2s ease-in-out infinite';
          break;
        case 'magenta-flash':
          styles.textShadow = '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6)';
          styles.animation = 'magentaFlash 1.5s ease-in-out infinite';
          break;
        case 'emerald-glow':
          styles.textShadow = '0 0 10px rgba(80, 200, 120, 0.8), 0 0 20px rgba(80, 200, 120, 0.6)';
          styles.animation = 'emeraldGlow 2s ease-in-out infinite';
          break;
        case 'coral-flow':
          console.log('✅ Matched: coral-flow');
          styles.background = 'linear-gradient(45deg, #FF7F50, #FFB6C1, #FFC0CB)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'coralFlow 3s ease infinite';
          break;
        // Handle generic "gradient" type by checking name or colors
        case 'gradient':
          console.log('🔍 Generic gradient detected, checking name/colors');
          if (name.includes('rainbow') && !name.includes('spotlight')) {
            styles.background = 'linear-gradient(45deg, #f0f, #0ff, #ff0, #f0f)';
            styles.backgroundSize = '300% 300%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'rainbowGradient 3s ease infinite';
          } else if (name.includes('fire')) {
            styles.background = 'linear-gradient(45deg, #FF4500, #FF6347, #FFD700)';
            styles.backgroundSize = '300% 300%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'fireGradient 2s ease infinite';
          } else if (name.includes('ocean')) {
            styles.background = 'linear-gradient(45deg, #00CED1, #1E90FF, #4169E1)';
            styles.backgroundSize = '300% 300%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'oceanWave 3s ease infinite';
          } else if (name.includes('sunset')) {
            styles.background = 'linear-gradient(45deg, #FF6347, #FF69B4, #FF1493)';
            styles.backgroundSize = '300% 300%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'sunsetGlow 4s ease infinite';
          } else if (name.includes('purple') || name.includes('dream')) {
            styles.background = 'linear-gradient(45deg, #9370DB, #BA55D3, #DA70D6)';
            styles.backgroundSize = '300% 300%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'purpleDream 3s ease infinite';
          } else if (name.includes('golden') || name.includes('shine')) {
            styles.background = 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)';
            styles.backgroundSize = '200% 100%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'goldenShine 2s linear infinite';
          } else if (name.includes('coral')) {
            styles.background = 'linear-gradient(45deg, #FF7F50, #FFB6C1, #FFC0CB)';
            styles.backgroundSize = '300% 300%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'coralFlow 3s ease infinite';
          } else {
            // Default gradient
            styles.background = 'linear-gradient(45deg, #f0f, #0ff, #ff0, #f0f)';
            styles.backgroundSize = '300% 300%';
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.animation = 'rainbowGradient 3s ease infinite';
          }
          break;
        default:
          console.log('⚠️ No switch case match for effectType:', effectType);
          break;
      }
    } else {
      console.log('⚠️ No effectType found, using fallback matching');
    }
    
    // Fallback: Match by name if effectType didn't match
    if (Object.keys(styles).length === 0) {
      console.log('🔄 Using fallback name matching for:', name);
      if (name.includes('neon') || name.includes('glow')) {
        styles.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4)';
        styles.animation = 'neonGlow 3s ease-in-out infinite';
      } else if (name.includes('rainbow') && !name.includes('spotlight')) {
        console.log('✅ Fallback matched: rainbow-gradient');
        styles.background = 'linear-gradient(45deg, #f0f, #0ff, #ff0, #f0f)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'rainbowGradient 3s ease infinite';
      } else if (name.includes('pulse') && !name.includes('cyan')) {
        console.log('✅ Fallback matched: pulse');
        styles.animation = 'pulseText 2s ease-in-out infinite';
        styles.transformOrigin = 'center';
      } else if (name.includes('dancing') || (name.includes('shadow') && !name.includes('animation'))) {
        styles.textShadow = '5px 5px 0px rgba(255, 107, 107, 0.8), -5px -5px 0px rgba(78, 205, 196, 0.8)';
        styles.animation = 'dancingShadow 2s ease-in-out infinite alternate';
      } else if (name.includes('glitch')) {
        styles.animation = 'glitchText 0.3s infinite';
        styles.position = 'relative';
      } else if (name.includes('3d') || name.includes('spin')) {
        styles.textShadow = '2px 2px 0px rgba(255, 0, 0, 0.8), 4px 4px 0px rgba(0, 255, 0, 0.6), 6px 6px 0px rgba(0, 0, 255, 0.4)';
        styles.animation = 'spin3D 4s linear infinite';
        styles.transformStyle = 'preserve-3d';
      } else if (name.includes('wavy')) {
        styles.animation = 'wavyText 2s ease-in-out infinite';
      } else if (name.includes('shimmer') || name.includes('masking')) {
        styles.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)';
        styles.backgroundSize = '200% 100%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'shimmerText 2s infinite';
      } else if (name.includes('split')) {
        styles.animation = 'splitText 1s ease-out forwards';
      } else if (name.includes('melting')) {
        styles.animation = 'meltingText 3s ease-in-out infinite';
        styles.position = 'relative';
      } else if (name.includes('explosive') || name.includes('burst')) {
        styles.animation = 'explosiveBurst 1s ease-out';
        styles.position = 'relative';
      } else if (name.includes('holographic')) {
        styles.background = 'linear-gradient(45deg, #FF006E, #8338EC, #3A86FF, #FF006E)';
        styles.backgroundSize = '400% 400%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'holographicText 4s ease infinite';
      } else if (name.includes('aurora')) {
        styles.background = 'linear-gradient(45deg, #00FF88, #00D4FF, #8B00FF)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'auroraText 5s ease infinite';
      } else if (name.includes('typewriter')) {
        styles.animation = 'typewriterText 3s steps(40) infinite';
        styles.borderRight = '2px solid';
        styles.whiteSpace = 'nowrap';
        styles.overflow = 'hidden';
      } else if (name.includes('glowing') && name.includes('3d')) {
        styles.textShadow = '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)';
        styles.animation = 'glowing3D 3s ease-in-out infinite';
        styles.transformStyle = 'preserve-3d';
      } else if (name.includes('shadow') && name.includes('animation')) {
        styles.textShadow = '2px 2px 0px rgba(255, 107, 107, 0.8), 4px 4px 0px rgba(78, 205, 196, 0.6), 6px 6px 0px rgba(69, 183, 209, 0.4)';
        styles.animation = 'shadowAnimation 2s ease-in-out infinite alternate';
      } else if (name.includes('rainbow') && name.includes('spotlight')) {
        styles.background = 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)';
        styles.backgroundSize = '200% 100%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'rainbowSpotlight 3s linear infinite';
      } else if (name.includes('fire') && name.includes('gradient')) {
        styles.background = 'linear-gradient(45deg, #FF4500, #FF6347, #FFD700)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'fireGradient 2s ease infinite';
      } else if (name.includes('ocean')) {
        styles.background = 'linear-gradient(45deg, #00CED1, #1E90FF, #4169E1)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'oceanWave 3s ease infinite';
      } else if (name.includes('sunset')) {
        styles.background = 'linear-gradient(45deg, #FF6347, #FF69B4, #FF1493)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'sunsetGlow 4s ease infinite';
      } else if (name.includes('electric') && name.includes('blue')) {
        styles.textShadow = '0 0 10px rgba(0, 191, 255, 0.8), 0 0 20px rgba(0, 191, 255, 0.6), 0 0 30px rgba(0, 191, 255, 0.4)';
        styles.animation = 'electricBlue 2s ease-in-out infinite';
      } else if (name.includes('purple') || name.includes('dream')) {
        styles.background = 'linear-gradient(45deg, #9370DB, #BA55D3, #DA70D6)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'purpleDream 3s ease infinite';
      } else if (name.includes('golden') || name.includes('shine')) {
        styles.background = 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)';
        styles.backgroundSize = '200% 100%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'goldenShine 2s linear infinite';
      } else if (name.includes('cyan') && name.includes('pulse')) {
        styles.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6)';
        styles.animation = 'cyanPulse 2s ease-in-out infinite';
      } else if (name.includes('magenta')) {
        styles.textShadow = '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6)';
        styles.animation = 'magentaFlash 1.5s ease-in-out infinite';
      } else if (name.includes('emerald')) {
        styles.textShadow = '0 0 10px rgba(80, 200, 120, 0.8), 0 0 20px rgba(80, 200, 120, 0.6)';
        styles.animation = 'emeraldGlow 2s ease-in-out infinite';
      } else if (name.includes('coral')) {
        styles.background = 'linear-gradient(45deg, #FF7F50, #FFB6C1, #FFC0CB)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'coralFlow 3s ease infinite';
      }
    }
    
    console.log('✅ Applied styles:', styles);
    return { styles, effectData };
  };

  return (
    <div className="relative min-h-screen font-poppins bg-black">
      {!entered && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black"
          onClick={handleEnter}
        >
          <img
            src="/mecha.png"
            alt="Mecha Logo"
            className="w-36 h-36 animate-pulse opacity-100 scale-100 drop-shadow-[0_0_20px_#8b5cf6] mb-5"
          />
          <h1 className="font-extrabold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-4xl md:text-5xl">
            Welcome to Mecha
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">Click to Enter</p>
        </div>
      )}
      <div
        className="fixed inset-0 flex justify-center items-center"
        style={{
          background: profile?.background
            ? `url(${profile.background}) center/cover no-repeat`
            : "#000",
          opacity: showProfile ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        
        <div style={containerStyle}>
          <ProfileBackground profile={profile} />
          <div style={subContainerStyle}>
            {/* Background layer với opacity - chỉ làm mờ background, không ảnh hưởng nội dung */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: backgroundColor,
                opacity: opacity,
                borderRadius: parsedStyles?.profileBorderRadius ?? "16px",
                zIndex: 0,
                pointerEvents: "none", // Cho phép click xuyên qua
              }}
            />
            {/* Nội dung container - không bị ảnh hưởng bởi opacity */}
            <div style={{ position: "relative", zIndex: 1 }}>
            {isLeftAligned ? (
              <>
                {/* Left-aligned layout: Avatar on left, info on right */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '16px',
                    width: '100%',
                    order: parsedStyles?.avatarOrder || 1,
                    ...getAnimationStyle(elementsVisible.avatar || elementsVisible.username)
                  }}
                >
                  {/* Avatar */}
                  <div style={{ flexShrink: 0, ...getAnimationStyle(elementsVisible.avatar) }}>
                    <ProfileAvatar profile={profile} parsedStyles={parsedStyles} />
                  </div>
                  
                  {/* Info column */}
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                  }}>
                    {(() => {
                      const wrapperStyle = getAnimationStyle(elementsVisible.username, !!appliedEffect && Object.keys(getEffectStyles(appliedEffect).styles).length > 0);
                      return (
                        <div style={{ ...wrapperStyle, width: '100%' }}>
                          <ProfileUsername 
                            profile={profile} 
                            parsedStyles={parsedStyles}
                            effectStyles={appliedEffect ? getEffectStyles(appliedEffect).styles : {}}
                            effectData={appliedEffect ? getEffectStyles(appliedEffect).effectData : undefined}
                          />
                        </div>
                      );
                    })()}
                    <div style={getAnimationStyle(elementsVisible.description)}>
                      <ProfileDescription 
                        profile={profile} 
                        parsedStyles={parsedStyles}
                      />
                    </div>
                    <div style={getAnimationStyle(elementsVisible.location)}>
                      <ProfileLocation profile={profile} parsedStyles={parsedStyles} />
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div style={{ 
                  order: parsedStyles?.iconOrder || 5, 
                  marginTop: '16px', 
                  ...getAnimationStyle(elementsVisible.socialLinks) 
                }}>
                  <SocialLinks userId={profile.userId} />
                </div>
                
                {/* Audio Player */}
                <div style={{ 
                  order: parsedStyles?.audioOrder || 6, 
                  ...getAnimationStyle(elementsVisible.audio) 
                }}>
                  <AudioPlayer ref={audioRef} profile={profile} parsedStyles={parsedStyles} />
                </div>
              </>
            ) : (
              <>
                {/* Centered layout: All elements in column - theo thứ tự preset */}
                <div style={{ 
                  order: parsedStyles?.avatarOrder || 1, 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...getAnimationStyle(elementsVisible.avatar) 
                }}>
                  <ProfileAvatar profile={profile} parsedStyles={parsedStyles} />
                </div>
                <div style={{ 
                  order: parsedStyles?.usernameOrder || 2, 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...getAnimationStyle(elementsVisible.username, !!appliedEffect && Object.keys(getEffectStyles(appliedEffect).styles).length > 0) 
                }}>
                  <ProfileUsername 
                    profile={profile} 
                    parsedStyles={parsedStyles}
                    effectStyles={appliedEffect ? getEffectStyles(appliedEffect).styles : {}}
                    effectData={appliedEffect ? getEffectStyles(appliedEffect).effectData : undefined}
                  />
                </div>
                <div style={{ 
                  order: parsedStyles?.descriptionOrder || 3, 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...getAnimationStyle(elementsVisible.description) 
                }}>
                  <ProfileDescription 
                    profile={profile} 
                    parsedStyles={parsedStyles}
                  />
                </div>
                <div style={{ 
                  order: parsedStyles?.locationOrder || 4, 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...getAnimationStyle(elementsVisible.location) 
                }}>
                  <ProfileLocation profile={profile} parsedStyles={parsedStyles} />
                </div>
                <div style={{ 
                  order: parsedStyles?.iconOrder || 5, 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '10px',
                  ...getAnimationStyle(elementsVisible.socialLinks) 
                }}>
                  <SocialLinks userId={profile.userId} />
                </div>
                <div style={{ 
                  order: parsedStyles?.audioOrder || 6, 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...getAnimationStyle(elementsVisible.audio) 
                }}>
                  <AudioPlayer ref={audioRef} profile={profile} parsedStyles={parsedStyles} />
                </div>
              </>
            )}
            </div>
            {/* End content wrapper */}
          </div>
        </div>
      </div>
      
      {/* Hack Effect - Background Canvas */}
      {appliedEffect && appliedEffect.product && (appliedEffect.product.category === 'animation' && (getEffectStyles(appliedEffect).effectData?.type === 'matrix' || getEffectStyles(appliedEffect).effectData?.type === 'matrix-rain' || appliedEffect.product.name?.toLowerCase().includes('matrix') || appliedEffect.product.name?.toLowerCase().includes('hack'))) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.3 }}>
          <EffectRenderer
            effectType="animation"
            effectData={getEffectStyles(appliedEffect).effectData || { type: 'matrix', color: '#00FF41' }}
            appliedTo="profile"
          />
        </div>
      )}
      
      {/* Fireworks Effect - CSS */}
      {appliedEffect && appliedEffect.product && (appliedEffect.product.name?.toLowerCase().includes('fireworks') || getEffectStyles(appliedEffect).effectData?.type === 'fireworks') && (
        <CSSFireworks />
      )}
      
      {/* CSS Text Animations - Prismic Examples */}
      <style>{`
        @keyframes neonGlow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 0, 255, 0.8), 0 0 30px rgba(255, 0, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4);
          }
        }
        @keyframes rainbowGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseText {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes dancingShadow {
          0% {
            text-shadow: 5px 5px 0px rgba(255, 107, 107, 0.8), -5px -5px 0px rgba(78, 205, 196, 0.8);
          }
          100% {
            text-shadow: -5px -5px 0px rgba(255, 107, 107, 0.8), 5px 5px 0px rgba(78, 205, 196, 0.8);
          }
        }
        @keyframes glitchText {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes spin3D {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes wavyText {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-10px); }
            75% { transform: translateY(10px); }
        }
        @keyframes shimmerText {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes splitText {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes meltingText {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(5px) scaleY(0.95); }
        }
        @keyframes explosiveBurst {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes holographicText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes auroraText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes typewriterText {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes glowing3D {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6);
            transform: rotateY(0deg);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8);
            transform: rotateY(180deg);
          }
        }
        @keyframes shadowAnimation {
          0% {
            text-shadow: 2px 2px 0px rgba(255, 107, 107, 0.8), 4px 4px 0px rgba(78, 205, 196, 0.6);
          }
          50% {
            text-shadow: -2px -2px 0px rgba(255, 107, 107, 0.8), -4px -4px 0px rgba(78, 205, 196, 0.6);
          }
          100% {
            text-shadow: 2px 2px 0px rgba(255, 107, 107, 0.8), 4px 4px 0px rgba(78, 205, 196, 0.6);
          }
        }
        @keyframes rainbowSpotlight {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes fireGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes oceanWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes sunsetGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes purpleDream {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes goldenShine {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes coralFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes electricBlue {
          0%, 100% {
            text-shadow: 0 0 10px rgba(0, 191, 255, 0.8), 0 0 20px rgba(0, 191, 255, 0.6), 0 0 30px rgba(0, 191, 255, 0.4);
          }
          50% {
            text-shadow: 0 0 20px rgba(0, 191, 255, 1), 0 0 30px rgba(0, 191, 255, 0.8), 0 0 40px rgba(0, 191, 255, 0.6);
          }
        }
        @keyframes cyanPulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6);
            transform: scale(1);
          }
          50% {
            text-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 30px rgba(0, 255, 255, 0.8);
            transform: scale(1.05);
          }
        }
        @keyframes magentaFlash {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6);
            opacity: 1;
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 0, 255, 1), 0 0 40px rgba(255, 0, 255, 0.8);
            opacity: 0.9;
          }
        }
        @keyframes emeraldGlow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(80, 200, 120, 0.8), 0 0 20px rgba(80, 200, 120, 0.6);
          }
          50% {
            text-shadow: 0 0 20px rgba(80, 200, 120, 1), 0 0 30px rgba(80, 200, 120, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
