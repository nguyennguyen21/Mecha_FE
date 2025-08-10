// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant, onClick }) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg';

  const variants = {
    primary: 'bg-purple-900 text-white hover:bg-purple-800 border-1 border-purple-400',
    secondary: 'bg-transparent border-2 border-white text-white hover:bg-white/10',
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