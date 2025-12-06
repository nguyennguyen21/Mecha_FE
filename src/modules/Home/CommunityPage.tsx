import React, { useState, useEffect } from "react";
import Button from "../../modules/Core/Components/button/Button";

const COMMUNITY_DISCORD_LINK: string = "https://discord.gg/YOUR_DISCORD_INVITE";
const BADGE_STORE_LINK: string = "https://mechabot.com/badges";

const CommunityHero: React.FC = () => {
  const [joinRipples, setJoinRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [badgeRipples, setBadgeRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleJoinClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setJoinRipples([...joinRipples, { x, y, id }]);
    setTimeout(() => {
      setJoinRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    window.open(COMMUNITY_DISCORD_LINK, "_blank");
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setBadgeRipples([...badgeRipples, { x, y, id }]);
    setTimeout(() => {
      setBadgeRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    window.open(BADGE_STORE_LINK, "_blank");
  };

  return (
    <section className="relative w-full text-white py-8 md:py-12 px-4 md:px-12 flex flex-col items-center overflow-hidden">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        {[...Array(80)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${i % 2 === 0 ? '139, 92, 246' : '236, 72, 153'}, ${Math.random() * 0.5 + 0.3})`,
              boxShadow: `0 0 ${Math.random() * 15 + 10}px rgba(${i % 2 === 0 ? '139, 92, 246' : '236, 72, 153'}, 0.6)`,
              animation: `particleFloat ${Math.random() * 15 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Title with Animation */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center md:text-left max-w-3xl hover:scale-105 transition-transform duration-300 cursor-default">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Welcome to the Mecha Community
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-200 max-w-2xl text-center md:text-left hover:text-white transition-colors duration-300">
          Join our official Discord community to connect with other users, participate in events, 
          get support, and collect exclusive badges!
        </p>

        {/* Action Buttons with Ripple Effect */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl justify-center md:justify-start">
          <div className="relative overflow-hidden rounded-lg">
            {joinRipples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-white/30 pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: '0px',
                  height: '0px',
                  transform: 'translate(-50%, -50%)',
                  animation: 'ripple 0.6s ease-out',
                }}
              />
            ))}
            <Button variant="primary" onClick={handleJoinClick} className="relative z-10 hover:scale-110 transition-transform duration-300">
              Join Discord
            </Button>
          </div>
          <div className="relative overflow-hidden rounded-lg">
            {badgeRipples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-white/30 pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: '0px',
                  height: '0px',
                  transform: 'translate(-50%, -50%)',
                  animation: 'ripple 0.6s ease-out',
                }}
              />
            ))}
            <Button variant="secondary" onClick={handleBadgeClick} className="relative z-10 hover:scale-110 transition-transform duration-300">
              Buy Badges
            </Button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.3; }
          25% { transform: translate(30px, -40px) scale(1.3) rotate(90deg); opacity: 0.7; }
          50% { transform: translate(-25px, -70px) scale(0.7) rotate(180deg); opacity: 0.5; }
          75% { transform: translate(15px, -50px) scale(1.2) rotate(270deg); opacity: 0.6; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 300px; height: 300px; opacity: 0; }
        }
        .animate-gradient {
          animation: gradientShift 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default CommunityHero;
