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
  const baseClasses = "font-mono font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-cocoa text-givry border-2 border-cocoa hover:bg-transparent hover:text-cocoa px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(70,24,40,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(70,24,40,0.2)] hover:translate-x-[1px] hover:translate-y-[1px]",
    secondary: "bg-thatch text-white border-2 border-thatch hover:bg-transparent hover:text-thatch px-4 py-2 rounded-lg shadow-[3px_3px_0px_0px_rgba(182,148,144,0.4)]",
    ghost: "bg-transparent text-cocoa hover:bg-cocoa/5 px-4 py-2 rounded-lg border border-transparent hover:border-cocoa/20"
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