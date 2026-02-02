import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', className = '' }) => {
  const baseClasses = "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-mono border";
  
  const variants = {
    primary: "bg-cocoa text-givry border-cocoa",
    secondary: "bg-thatch text-white border-thatch",
    outline: "bg-transparent text-cocoa border-cocoa/30"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {label}
    </span>
  );
};