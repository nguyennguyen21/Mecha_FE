import React, { useEffect, useRef } from 'react';

interface CSSFireworksProps {
  className?: string;
}

const CSSFireworks: React.FC<CSSFireworksProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createFirework = () => {
      const firework = document.createElement('div');
      firework.className = 'firework-explosion';
      
      // Random position
      const x = Math.random() * 100;
      const y = 20 + Math.random() * 40; // Upper portion
      firework.style.left = `${x}%`;
      firework.style.top = `${y}%`;
      
      // Create particles
      const particleCount = 12;
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        const angle = (360 / particleCount) * i;
        const distance = 50 + Math.random() * 30;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 0.2;
        const duration = 0.8 + Math.random() * 0.4;
        
        // Calculate end position using trigonometry
        const rad = (angle * Math.PI) / 180;
        const endX = Math.cos(rad) * distance;
        const endY = Math.sin(rad) * distance;
        
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        firework.appendChild(particle);
      }
      
      container.appendChild(firework);
      
      // Remove after animation
      setTimeout(() => {
        if (firework.parentNode) {
          firework.parentNode.removeChild(firework);
        }
      }, 2000);
    };

    // Create firework every 1.5-3 seconds
    const interval = setInterval(() => {
      createFirework();
    }, 1500 + Math.random() * 1500);

    // Create initial firework
    createFirework();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className={`css-fireworks-container ${className}`}></div>
      <style>{`
        .css-fireworks-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .firework-explosion {
          position: absolute;
          width: 4px;
          height: 4px;
        }

        .firework-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: fireworkExplode var(--duration, 1s) ease-out var(--delay, 0s) forwards;
        }

        @keyframes fireworkExplode {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--end-x, 0px)), calc(-50% + var(--end-y, 0px))) scale(0);
          }
        }
      `}</style>
    </>
  );
};

export default CSSFireworks;
