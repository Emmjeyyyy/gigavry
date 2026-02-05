
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseClasses = "font-mono font-bold uppercase tracking-wider transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.99] will-change-transform transform-gpu backface-hidden";
  
  const variants = {
    primary: "bg-cocoa text-givry border-2 border-cocoa hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] px-6 py-3 rounded-lg",
    
    secondary: "bg-thatch text-white border-2 border-thatch hover:translate-x-[0.5px] hover:translate-y-[0.5px] px-4 py-2 rounded-lg",
    
    ghost: "bg-transparent text-cocoa hover:text-gigas hover:bg-cocoa/5 px-4 py-2 rounded-lg border border-transparent active:bg-cocoa/10"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};