
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
    primary: "bg-cocoa text-givry border-2 border-cocoa shadow-[4px_4px_0px_0px_rgba(70,24,40,0.2),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:shadow-[3.5px_3.5px_0px_0px_rgba(70,24,40,0.2),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] px-6 py-3 rounded-lg",
    
    secondary: "bg-thatch text-white border-2 border-thatch shadow-[3px_3px_0px_0px_rgba(182,148,144,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:shadow-[2.5px_2.5px_0px_0px_rgba(182,148,144,0.4)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] px-4 py-2 rounded-lg",
    
    ghost: "bg-transparent text-cocoa hover:text-gigas hover:bg-cocoa/5 px-4 py-2 rounded-lg border border-transparent hover:border-cocoa/20 active:bg-cocoa/10"
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