// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant, onClick }) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg';

  const variants = {
    primary: 'bg-[#072607] text-white border border-green-400 text-[16.5px] opacity-90 cursor-pointer hover:bg-[#072607]',
    secondary: 'bg-transparent border-2 border-white text-white opacity-90 cursor-pointer hover:bg-white/10',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;