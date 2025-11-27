import React, { useEffect, useRef } from 'react';

interface EffectRendererProps {
  effectType: string;
  effectData?: string;
  appliedTo?: string;
  className?: string;
}

const EffectRenderer: React.FC<EffectRendererProps> = ({ 
  effectType, 
  effectData, 
  appliedTo = 'profile',
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let config: any = {};
    if (effectData) {
      try {
        config = JSON.parse(effectData);
      } catch (e) {
        console.error('Failed to parse effect data:', e);
      }
    }

    // Cleanup previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Render effect based on type/category
    const effectName = (effectData ? (config.type || '') : '').toLowerCase();
    
    if (effectType === 'particle' || effectName.includes('sparkle') || effectName.includes('stardust')) {
      if (effectName.includes('hearts')) {
        renderHearts(ctx, canvas, config);
      } else if (effectName.includes('snow')) {
        renderSnow(ctx, canvas, config);
      } else if (effectName.includes('fireworks')) {
        renderFireworks(ctx, canvas, config);
      } else if (effectName.includes('confetti')) {
        renderConfetti(ctx, canvas, config);
      } else if (effectName.includes('bubbles')) {
        renderBubbles(ctx, canvas, config);
      } else {
        renderSparkle(ctx, canvas, config);
      }
    } else if (effectType === 'animation' || effectName.includes('matrix') || effectName.includes('rain')) {
      renderMatrix(ctx, canvas, config);
    } else if (effectName.includes('aurora')) {
      renderAurora(ctx, canvas, config);
    } else if (effectName.includes('energy')) {
      renderEnergyWaves(ctx, canvas, config);
    } else if (effectName.includes('lightning')) {
      renderLightning(ctx, canvas, config);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effectType, effectData, appliedTo]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

// Sparkle Particles Effect
const renderSparkle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
  const count = config.count || 50;
  const color = config.color || '#FFD700';

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random()
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.y += particle.speed;
      particle.opacity += (Math.random() - 0.5) * 0.1;
      particle.opacity = Math.max(0, Math.min(1, particle.opacity));

      if (particle.y > canvas.height) {
        particle.y = 0;
        particle.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  };

  animate();
};

// Floating Hearts Effect
const renderHearts = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const hearts: Array<{ x: number; y: number; size: number; speed: number; rotation: number }> = [];
  const count = config.count || 20;

  for (let i = 0; i < count; i++) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 15 + 10,
      speed: Math.random() * 2 + 0.5,
      rotation: Math.random() * Math.PI * 2
    });
  }

  const drawHeart = (x: number, y: number, size: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(0, size / 4);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 4);
    ctx.bezierCurveTo(-size / 2, size / 2, 0, size * 0.75, 0, size);
    ctx.bezierCurveTo(0, size * 0.75, size / 2, size / 2, size / 2, size / 4);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);
    ctx.fill();
    ctx.restore();
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hearts.forEach(heart => {
      heart.y -= heart.speed;
      heart.rotation += 0.02;
      if (heart.y < -heart.size) {
        heart.y = canvas.height + heart.size;
        heart.x = Math.random() * canvas.width;
      }
      drawHeart(heart.x, heart.y, heart.size, heart.rotation);
    });

    requestAnimationFrame(animate);
  };

  animate();
};

// Snowflakes Effect
const renderSnow = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const snowflakes: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
  const count = config.count || 50;

  for (let i = 0; i < count; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.5
    });
  }

  const drawSnowflake = (x: number, y: number, size: number) => {
    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${snowflakes[0].opacity})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + size);
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }
    ctx.restore();
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    snowflakes.forEach(snowflake => {
      snowflake.y += snowflake.speed;
      snowflake.x += Math.sin(snowflake.y * 0.01) * 0.5;
      if (snowflake.y > canvas.height) {
        snowflake.y = 0;
        snowflake.x = Math.random() * canvas.width;
      }
      drawSnowflake(snowflake.x, snowflake.y, snowflake.size);
    });

    requestAnimationFrame(animate);
  };

  animate();
};

// Fireworks Effect - Realistic fireworks with rocket launch and explosion
const renderFireworks = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  interface Rocket {
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetY: number;
    exploded: boolean;
    trail: Array<{ x: number; y: number; life: number }>;
  }

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
    trail: Array<{ x: number; y: number; life: number }>;
  }

  const rockets: Rocket[] = [];
  const particles: Particle[] = [];
  const colors = config.colors || [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'
  ];
  let lastFirework = 0;

  const createRocket = () => {
    const x = Math.random() * canvas.width;
    const targetY = 50 + Math.random() * (canvas.height * 0.4); // Explode in upper portion
    const speed = 3 + Math.random() * 2;
    
    rockets.push({
      x,
      y: canvas.height,
      vx: (Math.random() - 0.5) * 0.5, // Slight horizontal drift
      vy: -speed,
      targetY,
      exploded: false,
      trail: []
    });
  };

  const explodeRocket = (rocket: Rocket) => {
    const particleCount = 80 + Math.floor(Math.random() * 40); // 80-120 particles
    const explosionType = Math.random();
    
    // Create colorful explosion
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 1.5 + Math.random() * 2.5;
      
      // Some particles have different speeds for layered effect
      const particleSpeed = explosionType > 0.7 ? speed * 1.5 : speed;
      
      particles.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * particleSpeed,
        vy: Math.sin(angle) * particleSpeed,
        life: 1,
        color,
        size,
        trail: []
      });
    }
  };

  const animate = () => {
    // Fade background slightly
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create new rocket every 1.5-3 seconds
    if (Date.now() - lastFirework > 1500 + Math.random() * 1500) {
      createRocket();
      lastFirework = Date.now();
    }

    // Update and draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i];
      
      // Add trail point
      rocket.trail.push({ x: rocket.x, y: rocket.y, life: 1 });
      if (rocket.trail.length > 5) {
        rocket.trail.shift();
      }
      
      // Update position
      rocket.x += rocket.vx;
      rocket.y += rocket.vy;
      
      // Draw rocket trail
      rocket.trail.forEach((point, idx) => {
        const alpha = (idx + 1) / rocket.trail.length * 0.6;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFD700'; // Golden rocket
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      // Draw rocket
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(rocket.x, rocket.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Check if should explode
      if (rocket.y <= rocket.targetY && !rocket.exploded) {
        explodeRocket(rocket);
        rocket.exploded = true;
      }
      
      // Remove rocket if exploded and off screen
      if (rocket.exploded && rocket.y < -10) {
        rockets.splice(i, 1);
      }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      
      // Add trail point
      particle.trail.push({ x: particle.x, y: particle.y, life: particle.life });
      if (particle.trail.length > 8) {
        particle.trail.shift();
      }
      
      // Update position with gravity
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.15; // Gravity
      particle.vx *= 0.98; // Air resistance
      particle.vy *= 0.98;
      particle.life -= 0.015;
      
      if (particle.life > 0) {
        // Draw trail
        particle.trail.forEach((point, idx) => {
          const alpha = (idx + 1) / particle.trail.length * particle.life * 0.4;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        
        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = particle.life;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      } else {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  };

  animate();
};

// Hack Effect - Hacker-style code rain
const renderMatrix = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  // Hacker-style characters: hex codes, binary, and hacker keywords
  const hexChars = '0123456789ABCDEF';
  const binaryChars = '01';
  const symbols = '><{}[]()/*+-=!@#$%^&*';
  const hackerWords = ['HACK', 'ROOT', 'ACCESS', 'SYSTEM', 'LOGIN', 'PASS', 'AUTH', 'SHELL', 'EXEC', 'RUN', 'LOAD', 'INIT', 'BOOT', 'KERNEL', 'PROC', 'SYS', 'NET', 'HTTP', 'TCP', 'UDP', 'IP', 'PORT', 'FIRE', 'WALL', 'SEC', 'ADMIN', 'USER', 'PWD', 'KEY', 'CERT', 'SSL', 'TLS', 'ENCRYPT', 'DECRYPT', 'HASH', 'MD5', 'SHA', 'BASE64', 'HEX', 'BIN', 'NULL', 'VOID', 'INT', 'STR', 'BOOL', 'VAR', 'FUNC', 'CLASS', 'OBJ', 'API', 'REST', 'JSON', 'XML', 'ENV', 'TMP', 'LOG', 'ERR', 'WARN', 'INFO', 'DEBUG', 'FATAL', 'CRIT', 'PID', 'UID', 'GID', 'MODE', 'PERM', 'CHMOD', 'CHOWN', 'MKDIR', 'RM', 'CAT', 'GREP', 'FIND', 'SED', 'AWK', 'MAN', 'HELP', 'TEST', 'KILL', 'SIG'];
  
  // Combine all characters - prioritize hex and binary for hacker look
  const chars = hexChars + binaryChars + symbols;
  const fontSize = 18; // Larger font size for better readability
  // More columns for denser hacker look
  const columnSpacing = fontSize * 2.2; // Tighter spacing for more characters
  const columns = Math.floor(canvas.width / columnSpacing);
  const drops: number[] = [];
  const dropSpeeds: number[] = [];
  const dropTexts: string[] = []; // Store text for each drop
  const dropColors: string[] = []; // Store color for each drop

  // Terminal/hacker colors: green, red, yellow, cyan - brighter and more saturated
  const hackerColors = ['#00FF41', '#FF0040', '#FFFF00', '#00FFFF', '#FF8000', '#FF00FF'];
  const brightColors = ['#00FFAA', '#FF6666', '#FFFF99', '#99FFFF', '#FFBB66', '#FF99FF']; // Brighter, more visible

  // Initialize drops with random positions and slower speeds for readability
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -300;
    dropSpeeds[i] = (Math.random() * 0.3 + 0.2); // Slower: 0.2-0.5 for easier reading
    // More frequent hacker words for authentic hacker look
    dropTexts[i] = Math.random() > 0.7 ? hackerWords[Math.floor(Math.random() * hackerWords.length)] : chars[Math.floor(Math.random() * chars.length)];
    // Random color for each drop
    const colorIndex = Math.floor(Math.random() * hackerColors.length);
    dropColors[i] = brightColors[colorIndex];
  }

  const color = config.color || '#00FF41'; // Classic hacker green

  let lastFrameTime = Date.now();
  const targetFPS = 40; // Faster animation
  const frameDelay = 1000 / targetFPS;

  const animate = () => {
    const now = Date.now();
    const deltaTime = now - lastFrameTime;
    
    // Throttle to target FPS
    if (deltaTime < frameDelay) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = now;

    // Normal fade effect - minimal for better readability
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)'; // Very minimal fade for better readability
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `bold ${fontSize}px 'Courier New', monospace`; // Bold, larger font for better readability

    for (let i = 0; i < drops.length; i++) {
      const x = i * columnSpacing;
      const y = drops[i] * fontSize;
      
      // Draw main character/text
      if (y > 0 && y < canvas.height) {
        const text = dropTexts[i];
        const dropColor = dropColors[i];
        
        // Bright head character/text - more visible
        ctx.fillStyle = dropColor;
        ctx.fillText(text, x, y);
        
        // Shorter trail (2-4 characters) with minimal glow (15%) for readability
        const trailLength = text.length > 1 ? 2 : 4; // Shorter trail for words, minimal glow
        for (let j = 1; j <= trailLength; j++) {
          const trailY = (drops[i] - j) * fontSize;
          if (trailY > 0) {
            // Parse color and apply opacity - minimal glow (15%)
            const baseColor = dropColor;
            const opacity = (trailLength + 1 - j) / (trailLength + 1) * 0.15; // Minimal glow - 15%
            // Convert hex to rgba
            const r = parseInt(baseColor.slice(1, 3), 16);
            const g = parseInt(baseColor.slice(3, 5), 16);
            const b = parseInt(baseColor.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            // For trail, use single chars
            const trailText = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(trailText, x, trailY);
          }
        }
      }

      // Reset drop when it reaches bottom - slower reset for readability
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
        drops[i] = 0;
        dropSpeeds[i] = (Math.random() * 0.3 + 0.2); // Slower: 0.2-0.5
        // More frequent hacker words for authentic look
        dropTexts[i] = Math.random() > 0.7 ? hackerWords[Math.floor(Math.random() * hackerWords.length)] : chars[Math.floor(Math.random() * chars.length)];
        // Randomly change color sometimes
        if (Math.random() > 0.7) {
          const colorIndex = Math.floor(Math.random() * hackerColors.length);
          dropColors[i] = brightColors[colorIndex];
        }
      }
      
      drops[i] += dropSpeeds[i];
    }

    requestAnimationFrame(animate);
  };

  animate();
};

// Confetti Effect
const renderConfetti = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const confetti: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number }> = [];
  const colors = config.colors || ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  const count = config.count || 60;

  for (let i = 0; i < count; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * Math.PI * 2
    });
  }

  const animate = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((piece, index) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += 0.1;
      piece.vy += 0.1; // gravity

      if (piece.y > canvas.height) {
        piece.y = -10;
        piece.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  };

  animate();
};

// Bubbles Effect
const renderBubbles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const bubbles: Array<{ x: number; y: number; size: number; speed: number; color: string; opacity: number }> = [];
  const colors = config.colors || ['#FF6B9D', '#C44569', '#F8B500'];
  const count = config.count || 25;

  for (let i = 0; i < count; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: Math.random() * 30 + 10,
      speed: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bubbles.forEach(bubble => {
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(bubble.y * 0.01) * 0.5;

      if (bubble.y < -bubble.size) {
        bubble.y = canvas.height + bubble.size;
        bubble.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.globalAlpha = bubble.opacity;
      ctx.strokeStyle = bubble.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  };

  animate();
};

// Aurora Effect
const renderAurora = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const colors = config.colors || ['#00FF88', '#00D4FF', '#8B00FF'];
  let offset = 0;

  const animate = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 3; i++) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      const color1 = colors[i % colors.length];
      const color2 = colors[(i + 1) % colors.length];
      
      gradient.addColorStop(0, color1 + '40');
      gradient.addColorStop(0.5, color2 + '60');
      gradient.addColorStop(1, color1 + '40');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2 + Math.sin(offset + i) * 20);
      for (let x = 0; x < canvas.width; x += 10) {
        const y = canvas.height / 2 + Math.sin((x + offset + i * 50) * 0.01) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    offset += 0.5;
    requestAnimationFrame(animate);
  };

  animate();
};

// Energy Waves Effect
const renderEnergyWaves = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const color = config.color || '#00FFFF';
  const waves = config.waves || 3;
  let time = 0;

  const animate = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < waves; i++) {
      const radius = 50 + (time * 2) + (i * 30);
      const alpha = 1 - (radius / 300);
      
      if (alpha > 0) {
        ctx.strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    time += 0.5;
    if (time > 100) time = 0;
    requestAnimationFrame(animate);
  };

  animate();
};

// Lightning Effect
const renderLightning = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any) => {
  const color = config.color || '#FFFF00';
  let lastStrike = 0;

  const drawLightning = (x: number, y: number, targetY: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    let currentY = y;
    while (currentY < targetY) {
      currentY += Math.random() * 20 + 10;
      const newX = x + (Math.random() - 0.5) * 30;
      ctx.lineTo(newX, currentY);
    }
    ctx.stroke();
  };

  const animate = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Date.now() - lastStrike > 3000) {
      const x = Math.random() * canvas.width;
      drawLightning(x, 0, canvas.height);
      lastStrike = Date.now();
    }

    requestAnimationFrame(animate);
  };

  animate();
};

export default EffectRenderer;

