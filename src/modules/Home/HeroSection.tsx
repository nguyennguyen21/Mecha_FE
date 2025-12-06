import Button from "../../modules/Core/Components/button/Button";
import Search from "../../modules/Core/Components/Search/Search";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleClaimClick = () => {
    navigate("/dashboard");
  };


  return (
    <div className="relative min-h-[85vh] flex items-end md:items-center justify-center px-6 md:px-20 pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* NASA-style Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3), transparent)',
            left: '10%',
            top: '20%',
            animation: 'nebulaFloat 20s infinite ease-in-out',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.3), transparent)',
            right: '15%',
            bottom: '30%',
            animation: 'nebulaFloat 25s infinite ease-in-out reverse',
          }}
        />
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)',
              animation: `shootingStar ${Math.random() * 3 + 4}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Space Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${Math.random() > 0.5 ? '139, 92, 246' : '236, 72, 153'}, ${Math.random() * 0.5 + 0.3})`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(${Math.random() > 0.5 ? '139, 92, 246' : '236, 72, 153'}, 0.6)`,
              animation: `particleFloat ${Math.random() * 15 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Orbs with Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '139, 92, 246' : '236, 72, 153'}, 0.3), transparent)`,
              filter: 'blur(40px)',
              animation: `orbFloat ${Math.random() * 20 + 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute"
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              border: `2px solid rgba(${i % 3 === 0 ? '139, 92, 246' : i % 3 === 1 ? '236, 72, 153' : '59, 130, 246'}, 0.4)`,
              borderRadius: i % 2 === 0 ? '50%' : '20%',
              transform: `rotate(${i * 60}deg)`,
              animation: `rotateShape ${Math.random() * 15 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: `0 0 ${Math.random() * 30 + 20}px rgba(${i % 3 === 0 ? '139, 92, 246' : i % 3 === 1 ? '236, 72, 153' : '59, 130, 246'}, 0.5)`,
            }}
          />
        ))}
      </div>

      {/* Pulsing Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={`ring-${i}`}
            className="absolute rounded-full border-2"
            style={{
              width: `${200 + i * 150}px`,
              height: `${200 + i * 150}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: `rgba(${i % 2 === 0 ? '139, 92, 246' : '236, 72, 153'}, 0.3)`,
              animation: `pulseRing ${3 + i * 0.5}s infinite ease-out`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Colorful Particles Stream */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const randomOffset = (i * 7.3) % 200 - 100; // Deterministic but varied offset
          const colors = ['139, 92, 246', '236, 72, 153', '59, 130, 246'];
          const color = colors[i % 3];
          return (
            <div
              key={`stream-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                left: `${(i * 13.7) % 100}%`,
                top: `${-10 + (i * 5.3) % 20}%`,
                background: `rgba(${color}, ${0.4 + (i % 3) * 0.2})`,
                boxShadow: `0 0 ${10 + (i % 5)}px rgba(${color}, 0.8)`,
                animation: `particleStream ${5 + (i % 3) * 2}s infinite linear`,
                animationDelay: `${(i * 0.3) % 5}s`,
                '--stream-offset': `${randomOffset}px`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Static Background Gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.25), rgba(59, 130, 246, 0.2), transparent 60%)',
        }}
      />

      {/* Main Content */}
      <div className="relative w-full max-w-5xl flex flex-col items-center space-y-10 text-center z-10">
        {/* Heading with animation */}
        <div className="space-y-6 fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span 
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
              style={{
                backgroundSize: '200% auto',
                animation: 'gradientShift 3s ease infinite'
              }}
            >
              Create Your Unique Profile
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Showcase your personality with customizable profiles, stunning effects, and social links. 
            <span className="block mt-2 text-purple-400">Make your mark on the web.</span>
          </p>
        </div>

        {/* Search and Button Section */}
        <div className="w-full max-w-2xl fade-in-up animation-delay-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-0 group">
            <div className="flex-1 w-full sm:w-auto">
              <Search />
            </div>
            <Button variant="primary" onClick={handleClaimClick} className="whitespace-nowrap border-l-0 rounded-l-none rounded-r-lg">
              Get Started
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4 fade-in animation-delay-300">
            Enter a username above to view or create your profile
          </p>
        </div>

        {/* Quick Features with Fun Animations */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-12 fade-in animation-delay-400">
          <div className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-all duration-300 group cursor-pointer">
            <i className="bi bi-palette text-xl text-purple-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"></i>
            <span className="text-sm md:text-base group-hover:scale-105 transition-all duration-300">Customizable</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-all duration-300 group cursor-pointer">
            <i className="bi bi-stars text-xl text-pink-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"></i>
            <span className="text-sm md:text-base group-hover:scale-105 transition-all duration-300">Amazing Effects</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-all duration-300 group cursor-pointer">
            <i className="bi bi-link-45deg text-xl text-blue-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"></i>
            <span className="text-sm md:text-base group-hover:scale-105 transition-all duration-300">Social Links</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-all duration-300 group cursor-pointer">
            <i className="bi bi-lightning-charge text-xl text-yellow-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"></i>
            <span className="text-sm md:text-base group-hover:scale-105 transition-all duration-300">Fast & Easy</span>
          </div>
        </div>
      </div>

      {/* CSS Animations - WOW & FUNFUN Style */}
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes nebulaFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.2;
          }
          33% {
            transform: translate(50px, -50px) scale(1.2) rotate(120deg);
            opacity: 0.3;
          }
          66% {
            transform: translate(-40px, 40px) scale(0.8) rotate(240deg);
            opacity: 0.15;
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateX(800px) translateY(800px) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translate(40px, -50px) scale(1.3) rotate(90deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(-30px, -80px) scale(0.7) rotate(180deg);
            opacity: 0.5;
          }
          75% {
            transform: translate(20px, -40px) scale(1.2) rotate(270deg);
            opacity: 0.6;
          }
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(100px, -80px) scale(1.2);
            opacity: 0.5;
          }
          50% {
            transform: translate(-80px, -120px) scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translate(60px, -60px) scale(1.1);
            opacity: 0.45;
          }
        }

        @keyframes rotateShape {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: rotate(180deg) scale(1.2);
            opacity: 0.6;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.4;
          }
        }

        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes particleStream {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(var(--stream-offset, 0px)) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(236, 72, 153, 0.7), 0 0 60px rgba(236, 72, 153, 0.5), 0 0 80px rgba(59, 130, 246, 0.3);
          }
        }

        .animate-gradient {
          animation: gradientShift 3s ease infinite;
        }

        /* Search and Button Connection Glow */
        .group:hover input,
        .group:hover button {
          box-shadow: 0 0 30px rgba(17, 84, 156, 0.5), 0 0 60px rgba(17, 84, 156, 0.3), 0 0 90px rgba(139, 92, 246, 0.2);
          transform: translateY(-2px);
        }

        .group input:focus,
        .group button:focus {
          box-shadow: 0 0 40px rgba(17, 84, 156, 0.6), 0 0 80px rgba(17, 84, 156, 0.4), 0 0 120px rgba(139, 92, 246, 0.3);
        }

        /* Heading Glow Effect */
        h1 span {
          animation: textGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
