// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant, onClick, className }) => {
  const baseClasses = 'px-6 py-3 font-semibold transition-all duration-300';

  const variants = {
  primary: 'bg-gray-800/60 backdrop-blur-sm text-white border border-[#11549c] rounded-lg text-[16.5px] cursor-pointer hover:bg-gray-700/60 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg',
  secondary: 'bg-transparent border-2 border-white text-white opacity-90 cursor-pointer hover:border-white/70 hover:shadow-sm rounded-lg',
};


  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;