import React, { useEffect, useRef } from 'react';

interface TextParticlesProps {
  effectType: string;
  effectData?: any;
  textElement: HTMLElement | null;
}

const TextParticles: React.FC<TextParticlesProps> = ({ effectType, effectData, textElement }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Array<{ element: HTMLSpanElement; animation: number }>>([]);

  useEffect(() => {
    if (!textElement) {
      return;
    }
    
    // Wait for next tick to ensure containerRef is mounted
    const timeoutId = setTimeout(() => {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;
      const rect = textElement.getBoundingClientRect();
      const parentElement = container.parentElement;
      const parentRect = parentElement?.getBoundingClientRect() || { left: 0, top: 0 };
      
      // Position container relative to text
      container.style.position = 'absolute';
      container.style.left = `${rect.left - parentRect.left}px`;
      container.style.top = `${rect.top - parentRect.top}px`;
      container.style.width = `${rect.width}px`;
      container.style.height = `${rect.height}px`;
      container.style.pointerEvents = 'none';
      container.style.overflow = 'visible';
      container.style.zIndex = '10';

      const colors = effectData?.colors || [effectData?.color || '#FFD700'];
      const count = effectData?.count || 20;
      const emojis = effectData?.emojis || [];

      // Clear existing particles
      particlesRef.current.forEach(p => {
        cancelAnimationFrame(p.animation);
        if (p.element.parentNode) {
          p.element.parentNode.removeChild(p.element);
        }
      });
      particlesRef.current = [];
      container.innerHTML = '';

      const createParticle = (index: number) => {
        const particle = document.createElement('span');
        particle.style.position = 'absolute';
        particle.style.pointerEvents = 'none';
        particle.style.userSelect = 'none';
        
        let content = '';
        let size = '';
        
        switch (effectType) {
          case 'sparkle':
          case 'sparkle-particles':
          case 'magic-sparkles':
            content = '✨';
            size = '12px';
            break;
          case 'star-field':
            content = '⭐';
            size = '10px';
            break;
          case 'floating-hearts':
          case 'hearts':
            content = '💖';
            size = '14px';
            break;
          case 'fireflies':
            content = '●';
            size = '6px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            break;
          case 'bubbles':
            content = '○';
            size = '8px';
            particle.style.border = `2px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = 'transparent';
            break;
          case 'confetti':
            content = '';
            size = '6px';
            particle.style.width = size;
            particle.style.height = size;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;
            break;
        case 'snowflakes':
        case 'snow':
          content = '❄';
          size = '10px';
          // Snowflakes should be white/light blue
          particle.style.color = '#FFFFFF';
          particle.style.textShadow = '0 0 5px rgba(173, 216, 230, 0.8)';
          break;
          case 'dust-particles':
          case 'dust':
            content = '·';
            size = '8px';
            particle.style.color = colors[0];
            break;
          case 'energy-orbs':
            content = '●';
            size = '10px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;
            break;
          case 'floating-notes':
            content = '♪';
            size = '12px';
            particle.style.color = colors[0];
            break;
          case 'rainbow-dots':
          case 'colorful-dots':
            content = '●';
            size = '8px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            break;
          case 'glowing-rings':
            content = '○';
            size = '15px';
            particle.style.border = `2px solid ${colors[0]}`;
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = 'transparent';
            particle.style.boxShadow = `0 0 10px ${colors[0]}`;
            break;
          case 'floating-emojis':
            content = emojis[Math.floor(Math.random() * emojis.length)] || '✨';
            size = '14px';
            break;
          case 'fireworks':
            // Fireworks will be rendered as CSS particles, not emoji
            content = '';
            size = '0px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.borderRadius = '50%';
            const fireworkColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
            particle.style.backgroundColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
            particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}, 0 0 20px ${particle.style.backgroundColor}`;
            break;
          default:
            // Default to sparkle if type is just "sparkle" or unknown
            if (effectType === 'sparkle' || !effectType) {
              content = '✨';
              size = '12px';
            } else {
              content = '✨';
              size = '10px';
            }
        }
        
        if (content) {
          particle.textContent = content;
        }
        particle.style.fontSize = size;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = '0';
        
        container.appendChild(particle);
        
        // Animation
        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY + (Math.random() - 0.5) * 200;
        const duration = 2000 + Math.random() * 2000;
        const startTime = Date.now() + index * 50;
        
        const animate = () => {
          const now = Date.now();
          if (now < startTime) {
            const animId = requestAnimationFrame(animate);
            particlesRef.current[index].animation = animId;
            return;
          }
          
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          if (progress < 0.2) {
            particle.style.opacity = `${progress * 5}`;
          } else if (progress > 0.8) {
            particle.style.opacity = `${(1 - progress) * 5}`;
          } else {
            particle.style.opacity = '1';
          }
          
          const x = startX + (endX - startX) * progress;
          const y = startY + (endY - startY) * progress;
          particle.style.transform = `translate(${x - startX}px, ${y - startY}px)`;
          
          if (progress < 1) {
            const animId = requestAnimationFrame(animate);
            particlesRef.current[index].animation = animId;
          } else {
            // Reset particle
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.opacity = '0';
            const newStartTime = Date.now() + Math.random() * 1000;
            const newAnimId = requestAnimationFrame(() => {
              const newAnimate = () => {
                const newNow = Date.now();
                if (newNow < newStartTime) {
                  const animId = requestAnimationFrame(newAnimate);
                  particlesRef.current[index].animation = animId;
                  return;
                }
                const newElapsed = newNow - newStartTime;
                const newProgress = Math.min(newElapsed / duration, 1);
                if (newProgress < 0.2) {
                  particle.style.opacity = `${newProgress * 5}`;
                } else if (newProgress > 0.8) {
                  particle.style.opacity = `${(1 - newProgress) * 5}`;
                } else {
                  particle.style.opacity = '1';
                }
                const newX = startX + (endX - startX) * newProgress;
                const newY = startY + (endY - startY) * newProgress;
                particle.style.transform = `translate(${newX - startX}px, ${newY - startY}px)`;
                if (newProgress < 1) {
                  const animId = requestAnimationFrame(newAnimate);
                  particlesRef.current[index].animation = animId;
                }
              };
              newAnimate();
            });
            particlesRef.current[index].animation = newAnimId;
          }
        };
        
        const animId = requestAnimationFrame(animate);
        particlesRef.current[index] = { element: particle, animation: animId };
      };

      // Create particles
      for (let i = 0; i < count; i++) {
        createParticle(i);
      }

      // Update position on scroll/resize
      const updatePosition = () => {
        if (textElement && container) {
          const newRect = textElement.getBoundingClientRect();
          const newParentRect = container.parentElement?.getBoundingClientRect();
          if (newParentRect) {
            container.style.left = `${newRect.left - newParentRect.left}px`;
            container.style.top = `${newRect.top - newParentRect.top}px`;
            container.style.width = `${newRect.width}px`;
            container.style.height = `${newRect.height}px`;
          }
        }
      };

      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        particlesRef.current.forEach(p => {
          cancelAnimationFrame(p.animation);
          if (p.element.parentNode) {
            p.element.parentNode.removeChild(p.element);
          }
        });
        particlesRef.current = [];
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [effectType, effectData, textElement]);

  return <div ref={containerRef} className="text-particles-container" />;
};

export default TextParticles;

