// components/ProfileUsername.tsx
import React, { useRef, useEffect, useState } from 'react';
import { type ProfileData, type UserStyle } from '../types/profile';
import { createUsernameStyle } from '../utils/styleUtils';
import TextParticles from './TextParticles';

interface ProfileUsernameProps {
  profile: ProfileData;
  parsedStyles: UserStyle;
  effectStyles?: React.CSSProperties;
  effectData?: any;
}

const ProfileUsername: React.FC<ProfileUsernameProps> = ({ profile, parsedStyles, effectStyles = {}, effectData }) => {
  const usernameRef = useRef<HTMLHeadingElement>(null);
  const usernameStyle = createUsernameStyle(parsedStyles, profile);
  const [showParticles, setShowParticles] = useState(false);
  
  // Merge styles - ensure username is always visible
  const hasTransparentText = effectStyles.WebkitTextFillColor === 'transparent';
  const hasBackground = !!effectStyles.background;
  
  // Merge styles - effectStyles should override base styles completely
  const hasEffectAnimation = !!effectStyles.animation;
  const hasEffectTextShadow = !!effectStyles.textShadow;
  
  // Build base style without conflicting properties if effect has them
  const baseStyleWithoutConflicts: React.CSSProperties = {
    ...usernameStyle,
    // Remove conflicting properties from base if effect has them
    ...(hasEffectAnimation ? {
      transform: undefined,
      transition: undefined,
    } : {}),
    ...(hasEffectTextShadow ? {
      textShadow: undefined, // Remove textShadow from base if effect has it
    } : {}),
  };
  
  const finalStyle: React.CSSProperties = {
    ...baseStyleWithoutConflicts,
    ...effectStyles, // Effect styles override everything
    position: 'relative',
    // Only allow transparent text if there's a background gradient
    ...(hasTransparentText && !hasBackground ? {
      WebkitTextFillColor: undefined,
      WebkitBackgroundClip: undefined,
      color: usernameStyle.color || "#ffffff",
    } : hasTransparentText && hasBackground ? {
      // Keep transparent for gradient effects
      WebkitTextFillColor: 'transparent',
    } : {
      // Normal text - ensure color is visible
      color: effectStyles.color || usernameStyle.color || "#ffffff",
    }),
  };
  
  console.log('🎨 ProfileUsername finalStyle:', finalStyle);
  console.log('🎨 ProfileUsername - Animation in finalStyle:', finalStyle.animation);
  console.log('🎨 ProfileUsername - TransformOrigin in finalStyle:', finalStyle.transformOrigin);
  console.log('🎨 ProfileUsername - EffectStyles received:', effectStyles);
  console.log('🎨 ProfileUsername - Base usernameStyle:', usernameStyle);

  useEffect(() => {
    // Check if this is a particle effect
    // Particle effects have category "particle" or type contains "particle" or name contains "particle"
    const isParticleEffect = effectData && (
      effectData.type?.includes('particle') ||
      effectData.type === 'sparkle' ||
      effectData.type === 'sparkle-particles' ||
      effectData.type === 'star-field' ||
      effectData.type === 'floating-hearts' ||
      effectData.type === 'hearts' ||
      effectData.type === 'fireflies' ||
      effectData.type === 'bubbles' ||
      effectData.type === 'confetti' ||
      effectData.type === 'snowflakes' ||
      effectData.type === 'snow' ||
      effectData.type === 'dust-particles' ||
      effectData.type === 'dust' ||
      effectData.type === 'energy-orbs' ||
      effectData.type === 'floating-notes' ||
      effectData.type === 'rainbow-dots' ||
      effectData.type === 'glowing-rings' ||
      effectData.type === 'magic-sparkles' ||
      effectData.type === 'floating-emojis' ||
      effectData.type === 'colorful-dots' ||
      effectData.type === 'fireworks'
    );
    
    if (isParticleEffect) {
      console.log('✨ ProfileUsername - Particle effect detected:', effectData);
      setShowParticles(true);
    } else {
      // This is expected for text animations (like pulse, rainbow, etc.)
      // They are not particle effects, so particles won't be shown
      if (effectData) {
        console.log('ℹ️ ProfileUsername - Text animation effect (not particle):', effectData.type || effectData);
      }
      setShowParticles(false);
    }
  }, [effectData]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <h1 ref={usernameRef} style={finalStyle}>
        {profile.username}
      </h1>
      {showParticles && usernameRef.current && effectData && (
        <>
          {console.log('🎯 Rendering TextParticles with:', { effectType: effectData.type, effectData, hasTextElement: !!usernameRef.current })}
          <TextParticles
            effectType={effectData.type || 'sparkle'}
            effectData={effectData}
            textElement={usernameRef.current}
          />
        </>
      )}
    </div>
  );
};

export default ProfileUsername;