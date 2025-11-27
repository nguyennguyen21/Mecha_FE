import React, { useRef, useState, useEffect } from "react";

interface ProfileFormData {
  profileAvatar: string;
  background: string;
  audio: string;
  audioImage: string;
  audioTitle: string;
  description: string;
  username: string;
  effectUsername: string;
  location: string;
}

interface InformationProfileProps {
  formData: ProfileFormData;
  uploadingFiles: {
    profileAvatar: boolean;
    background: boolean;
  };
  getMediaUrl: (path: string) => string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileAvatar" | "background"
  ) => void;
}

const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  // Nếu chuỗi có khoảng trắng
  if (/\s/.test(value)) {
    alert("Username cannot contain space!");
    return;
  }

};


const InformationProfile: React.FC<InformationProfileProps> = ({
  formData,
  uploadingFiles,
  getMediaUrl,
  handleChange,
  handleFileChange,
}) => {
const avatarInputRef = useRef<HTMLInputElement>(null);
const bgInputRef = useRef<HTMLInputElement>(null);
const [isDraggingBg, setIsDraggingBg] = useState(false);
const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
const [showEffectPicker, setShowEffectPicker] = useState(false);
const [userEffects, setUserEffects] = useState<any[]>([]);
const [appliedEffect, setAppliedEffect] = useState<any>(null);
const [applying, setApplying] = useState(false);

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5159';
const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.idUser || 
               JSON.parse(localStorage.getItem('userInfo') || '{}')?.IdUser;

useEffect(() => {
  if (userId) {
    fetchUserEffects();
  }
}, [userId]);

// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (showEffectPicker && !target.closest('.effect-picker-container')) {
      setShowEffectPicker(false);
    }
  };

  if (showEffectPicker) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [showEffectPicker]);

const fetchUserEffects = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effects`);
    if (!res.ok) throw new Error('Failed to fetch effects');
    const effects = await res.json();
    
    // Fetch product details for all effects
    const effectsWithProducts = await Promise.all(
      effects.map(async (effect: any) => {
        try {
          const productRes = await fetch(`${API_BASE_URL}/api/Shop/product/${effect.productId}?userId=${userId}`);
          if (productRes.ok) {
            const product = await productRes.json();
            return { ...effect, product };
          }
        } catch (err) {
          console.error(`Failed to fetch product ${effect.productId}:`, err);
        }
        return effect;
      })
    );
    
    setUserEffects(effectsWithProducts);
    
    // Find active effect
    const active = effectsWithProducts.find((e: any) => e.isActive);
    if (active) {
      setAppliedEffect(active);
    } else {
      setAppliedEffect(null);
    }
  } catch (err) {
    console.error('Failed to fetch effects:', err);
  }
};

const handleApplyEffect = async (effect: any) => {
  if (!userId) return;
  
  try {
    setApplying(true);
    const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effect/${effect.effectId}/apply`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        AppliedTo: 'profile',
        Settings: effect.product?.effectData ? JSON.parse(effect.product.effectData) : null
      })
    });

    if (!res.ok) throw new Error('Failed to apply effect');
    
    setAppliedEffect(effect);
    setShowEffectPicker(false);
    await fetchUserEffects();
  } catch (err) {
    console.error('Failed to apply effect:', err);
    alert('Failed to apply effect');
  } finally {
    setApplying(false);
  }
};

// Apply effect styles based on effect type - Prismic CSS Text Animations + Colorful + Particles
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
  
  // If it's a particle effect, don't apply text styles, just return effectData for particles
  if (category === 'particle' || name.includes('particle') || 
      effectType?.includes('particle') || effectType === 'sparkle' ||
      effectType === 'sparkle-particles' || effectType === 'star-field' ||
      effectType === 'floating-hearts' || effectType === 'fireflies' ||
      effectType === 'bubbles' || effectType === 'confetti' ||
      effectType === 'snowflakes' || effectType === 'dust-particles' ||
      effectType === 'energy-orbs' || effectType === 'floating-notes' ||
      effectType === 'rainbow-dots' || effectType === 'glowing-rings' ||
      effectType === 'magic-sparkles' || effectType === 'floating-emojis' ||
      effectType === 'colorful-dots') {
    console.log('✨ Particle effect - returning effectData only');
    return { styles: {}, effectData };
  }
  
  // Match by effectType first (most reliable)
  if (effectType) {
    console.log('🔍 InformationProfile - Matching effectType:', effectType);
    switch (effectType) {
      case 'neon-glow':
        console.log('✅ InformationProfile - Matched: neon-glow');
        styles.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4)';
        styles.animation = 'neonGlow 3s ease-in-out infinite';
        break;
      case 'rainbow-gradient':
        console.log('✅ InformationProfile - Matched: rainbow-gradient');
        styles.background = 'linear-gradient(45deg, #f0f, #0ff, #ff0, #f0f)';
        styles.backgroundSize = '300% 300%';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.animation = 'rainbowGradient 3s ease infinite';
        break;
      case 'pulse':
        console.log('✅ InformationProfile - Matched: pulse');
        styles.animation = 'pulseText 2s ease-in-out infinite';
        styles.transformOrigin = 'center';
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
          console.log('✅ InformationProfile - Matched: coral-flow');
          styles.background = 'linear-gradient(45deg, #FF7F50, #FFB6C1, #FFC0CB)';
          styles.backgroundSize = '300% 300%';
          styles.WebkitBackgroundClip = 'text';
          styles.WebkitTextFillColor = 'transparent';
          styles.animation = 'coralFlow 3s ease infinite';
          break;
        default:
          console.log('⚠️ InformationProfile - No switch case match for effectType:', effectType);
          break;
      }
    } else {
      console.log('⚠️ InformationProfile - No effectType found, using fallback matching');
    }
    
    // Fallback: Match by name if effectType didn't match
    if (Object.keys(styles).length === 0) {
      console.log('🔄 InformationProfile - Using fallback name matching for:', name);
    if (name.includes('neon') || (name.includes('glow') && !name.includes('emerald') && !name.includes('electric'))) {
      styles.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4)';
      styles.animation = 'neonGlow 3s ease-in-out infinite';
    } else if (name.includes('rainbow') && name.includes('spotlight')) {
      styles.background = 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)';
      styles.backgroundSize = '200% 100%';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.animation = 'rainbowSpotlight 3s linear infinite';
    } else if (name.includes('rainbow') && !name.includes('spotlight')) {
      console.log('✅ InformationProfile - Fallback matched: rainbow-gradient');
      styles.background = 'linear-gradient(45deg, #f0f, #0ff, #ff0, #f0f)';
      styles.backgroundSize = '300% 300%';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.animation = 'rainbowGradient 3s ease infinite';
    } else if (name.includes('pulse') && !name.includes('cyan')) {
      console.log('✅ InformationProfile - Fallback matched: pulse');
      styles.animation = 'pulseText 2s ease-in-out infinite';
      styles.transformOrigin = 'center';
    } else if (name.includes('cyan') && name.includes('pulse')) {
      styles.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6)';
      styles.animation = 'cyanPulse 2s ease-in-out infinite';
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
    } else if (name.includes('fire') && name.includes('gradient')) {
      styles.background = 'linear-gradient(45deg, #FF4500, #FF6347, #FFD700)';
      styles.backgroundSize = '300% 300%';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.animation = 'fireGradient 2s ease infinite';
    } else if (name.includes('ocean') || (name.includes('wave') && !name.includes('wavy'))) {
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
    } else if (name.includes('purple') && name.includes('dream')) {
      styles.background = 'linear-gradient(45deg, #9370DB, #BA55D3, #DA70D6)';
      styles.backgroundSize = '300% 300%';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.animation = 'purpleDream 3s ease infinite';
    } else if (name.includes('golden') || (name.includes('shine') && !name.includes('sunset'))) {
      styles.background = 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)';
      styles.backgroundSize = '200% 100%';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.animation = 'goldenShine 2s linear infinite';
    } else if (name.includes('magenta')) {
      styles.textShadow = '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6)';
      styles.animation = 'magentaFlash 1.5s ease-in-out infinite';
    } else if (name.includes('emerald')) {
      styles.textShadow = '0 0 10px rgba(80, 200, 120, 0.8), 0 0 20px rgba(80, 200, 120, 0.6)';
      styles.animation = 'emeraldGlow 2s ease-in-out infinite';
    } else if (name.includes('coral')) {
      console.log('✅ InformationProfile - Fallback matched: coral-flow');
      styles.background = 'linear-gradient(45deg, #FF7F50, #FFB6C1, #FFC0CB)';
      styles.backgroundSize = '300% 300%';
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.animation = 'coralFlow 3s ease infinite';
    } else {
      console.log('❌ InformationProfile - No fallback match found for name:', name);
    }
  }
  
  console.log('✅ InformationProfile - Final applied styles:', styles, 'effectData:', effectData);
  return { styles, effectData };
};



  // Helper function để kiểm tra xem file có phải video không
const isVideoFile = (url: string): boolean => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
};

  // Drag and drop handlers for background
  const handleBgDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadingFiles.background) {
      setIsDraggingBg(true);
    }
  };

  const handleBgDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBg(false);
  };

  const handleBgDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBg(false);

    if (uploadingFiles.background) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
      if (validTypes.includes(file.type)) {
        const fakeEvent = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent, "background");
      }
    }
  };

  // Drag and drop handlers for avatar
  const handleAvatarDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadingFiles.profileAvatar) {
      setIsDraggingAvatar(true);
    }
  };

  const handleAvatarDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(false);
  };

  const handleAvatarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(false);

    if (uploadingFiles.profileAvatar) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const fakeEvent = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent, "profileAvatar");
      }
    }
  };

  return (
    <div>
      {/* Background Section */}
      <div
        className={`w-full h-96 rounded-3xl overflow-hidden relative cursor-pointer group shadow-2xl ring-1 transition-all duration-500 ${
          isDraggingBg 
            ? 'ring-4 ring-purple-500 bg-purple-500/20 scale-[1.02]' 
            : 'ring-gray-700/20 hover:shadow-3xl hover:ring-gray-600/30'
        }`}
        onClick={() => !uploadingFiles.background && bgInputRef.current?.click()}
        onDragEnter={handleBgDragEnter}
        onDragOver={handleBgDragOver}
        onDragLeave={handleBgDragLeave}
        onDrop={handleBgDrop}
      >
        {formData.background ? (
          isVideoFile(formData.background) ? (
            // Video background
            <video
              src={getMediaUrl(formData.background)}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            // Image background
            <img
              src={
                getMediaUrl(formData.background) ||
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
              }
              alt="Background"
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
          )
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center text-gray-300 transition-all ${
            isDraggingBg ? 'bg-purple-500/30' : 'bg-gray-900'
          }`}>
            <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
              isDraggingBg ? 'bg-purple-500/50 scale-110' : 'bg-gray-800/50'
            }`}>
              <i className={`fas ${isDraggingBg ? 'fa-cloud-upload-alt' : 'fa-cloud-upload'} text-2xl`}></i>
            </div>
            <p className="text-lg font-semibold tracking-wide">
              {isDraggingBg ? 'Drop file here' : 'Upload Background Image/Video'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {isDraggingBg ? 'Release to upload' : 'Drag & drop or click to browse'}
            </p>
          </div>
        )}
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/ogg"
          className="hidden"
          onChange={(e) => handleFileChange(e, "background")}
        />
        <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>
        {uploadingFiles.background && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-pulse">
            <div className="flex flex-col items-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400"></div>
              <p className="text-base mt-4 font-medium opacity-90">
                Uploading Background...
              </p>
            </div>
          </div>
        )}
        
        {/* Video Controls Indicator */}
        {formData.background && isVideoFile(formData.background) && (
          <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2 backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Avatar & Username */}
      <div className="relative flex items-end gap-6 -mt-20 px-6 sm:px-12">
        <div className="relative group">
          <div
            className={`w-40 h-40 rounded-full border-4 overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 transform hover:shadow-3xl hover:scale-105 bg-gray-900 ring-2 ${
              isDraggingAvatar 
                ? 'border-purple-500 ring-purple-500 scale-110 bg-purple-500/20' 
                : 'border-gray-800 ring-gray-700/40'
            }`}
            onClick={() =>
              !uploadingFiles.profileAvatar && avatarInputRef.current?.click()
            }
            onDragEnter={handleAvatarDragEnter}
            onDragOver={handleAvatarDragOver}
            onDragLeave={handleAvatarDragLeave}
            onDrop={handleAvatarDrop}
          >
            {formData.profileAvatar ? (
              <img
                src={
                  getMediaUrl(formData.profileAvatar) ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-gray-300 transition-all ${
                isDraggingAvatar ? 'bg-purple-500/30' : 'bg-gray-800'
              }`}>
                <i className={`fas ${isDraggingAvatar ? 'fa-cloud-upload-alt' : 'fa-user'} text-4xl ${isDraggingAvatar ? 'text-purple-400 animate-pulse' : 'opacity-70'}`}></i>
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "profileAvatar")}
            />
          </div>
          {uploadingFiles.profileAvatar && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-400"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center py-4 relative">
          {/* Effect Picker Button */}
          <div className="absolute -top-2 right-0 effect-picker-container">
            <button
              onClick={() => setShowEffectPicker(!showEffectPicker)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2"
            >
              <span>✨</span>
              <span>Effects</span>
              {appliedEffect && (
                <span className="px-2 py-0.5 bg-green-500 rounded-full text-xs">Active</span>
              )}
            </button>
            
            {/* Effect Picker Dropdown */}
            {showEffectPicker && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto effect-picker-container">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-bold text-lg">Apply Effect</h3>
                  <p className="text-gray-400 text-sm mt-1">Choose a text animation for your profile</p>
                </div>
                
                {userEffects.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <p className="mb-2">No effects owned yet</p>
                    <a href="/shop" className="text-purple-400 hover:text-purple-300 underline">
                      Visit Shop
                    </a>
                  </div>
                ) : (
                  <div className="p-2">
                    {userEffects.map((effect) => {
                      const product = effect.product || {};
                      return (
                        <div
                          key={effect.effectId}
                          className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                            effect.isActive
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : 'bg-gray-700/50 hover:bg-gray-700 border-2 border-transparent'
                          }`}
                          onClick={() => !applying && handleApplyEffect(effect)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{product.icon || '🎨'}</span>
                              <div>
                                <div className="text-white font-semibold">{product.name || effect.productName}</div>
                                <div className="text-gray-400 text-xs">{product.category || 'effect'}</div>
                              </div>
                            </div>
                            {effect.isActive && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Username with Effect */}
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg transition-transform duration-300 hover:scale-105"
            style={getEffectStyles(appliedEffect).styles}
          >
            {formData.username || "Your Name"}
          </h1>

          {/* Description */}
          <p className="text-gray-400 max-w-md mt-3 text-base sm:text-lg leading-relaxed italic font-light tracking-wide drop-shadow-md">
            {formData.description || "Tell the world who you are."}
          </p>
        </div>

      </div>

      {/* Profile Information Form */}
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700/30 p-8 mt-8 mx-6 sm:mx-12 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-200 tracking-tight">
            Profile Information
          </h2>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
              Username <span className="text-gray-500 text-xs">(max 20)</span>
            </label>
              <input
              type="text"
              name="username"
              maxLength={20}
              onChange={handleUsernameChange}
              className="w-full px-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 text-gray-300 placeholder-gray-500 bg-gray-800/80"
              placeholder="Enter your username"
            />

            </div>
            <div>
            </div>
          </div>

          <div>
           <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
              Description <span className="text-gray-500 text-xs font-normal">(max 100 characters)</span>
          </label>

            <textarea
              name="description"
              onChange={handleChange}
              rows={4}
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 resize-none text-gray-300 placeholder-gray-500 bg-gray-800/80"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight">
                Location
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none transition-all duration-200 text-gray-300 placeholder-gray-500 bg-gray-800/80"
                  placeholder="Where are you from?"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Text Animations - Prismic Examples + Colorful */}
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
        @keyframes electricBlue {
          0%, 100% {
            text-shadow: 0 0 10px rgba(0, 191, 255, 0.8), 0 0 20px rgba(0, 191, 255, 0.6);
          }
          50% {
            text-shadow: 0 0 20px rgba(0, 191, 255, 1), 0 0 30px rgba(0, 191, 255, 0.8);
          }
        }
        @keyframes purpleDream {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes goldenShine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
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
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 0, 255, 1), 0 0 40px rgba(255, 0, 255, 0.8);
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
        @keyframes coralFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default InformationProfile;