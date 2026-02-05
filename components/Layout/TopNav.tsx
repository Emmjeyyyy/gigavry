import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface TopNavProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ searchTerm, onSearchChange }) => {
  const location = useLocation();
  
  const getPlaceholder = () => {
    if (location.pathname.includes('game')) return 'Search free games...';
    if (location.pathname.includes('giveaway')) return 'Search giveaways...';
    return 'Search watchlist...';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `relative px-4 py-2 font-mono font-bold uppercase tracking-wider text-sm transition-all duration-200 rounded-md
    ${isActive 
      ? 'text-cocoa bg-givry border border-cocoa/20 translate-y-[-1px]' 
      : 'text-cocoa/60 hover:text-gigas hover:bg-givry/50'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full mb-8 pt-4 pb-2">
      <div className="bg-givry/90 backdrop-blur-md border border-cocoa/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="icon-grad-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="black" stopOpacity="0.2"/>
                <stop offset="1" stopColor="black" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="icon-grad-bot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="white" stopOpacity="0.2"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
            </defs>
            
            {/* Top: Gigas */}
            <circle cx="16" cy="6" r="6" fill="#4a3b9e" />
            <circle cx="16" cy="6" r="6" fill="url(#icon-grad-top)" />

            {/* Right: Givry + Border Cocoa */}
            <circle cx="26" cy="16" r="5.5" fill="#f7eec6" stroke="#461828" strokeWidth="1" />

            {/* Bottom: Cocoa */}
            <circle cx="16" cy="26" r="6" fill="#461828" />
            <circle cx="16" cy="26" r="6" fill="url(#icon-grad-bot)" />

            {/* Left: Thatch */}
            <circle cx="6" cy="16" r="6" fill="#b69490" />
            <circle cx="6" cy="16" r="6" fill="url(#icon-grad-top)" opacity="0.5" />
          </svg>
          
          <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none text-cocoa">
            GIGA<span className="text-thatch">GIVRY</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 p-1.5 bg-cocoa/5 rounded-lg overflow-x-auto max-w-full border border-cocoa/5">
          <NavLink to="/free-games" className={navLinkClass}>
            Games
          </NavLink>
          <NavLink to="/giveaways" className={navLinkClass}>
            Drops
          </NavLink>
          <NavLink to="/watchlist" className={navLinkClass}>
            Watchlist
          </NavLink>
        </nav>

        {/* Search */}
        <div className="relative w-full md:w-64 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-cocoa/40 group-focus-within:text-gigas transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-cocoa/20 rounded-lg leading-5 bg-white/50 placeholder-cocoa/40 
            focus:outline-none focus:border-cocoa focus:bg-white
            text-sm font-mono text-cocoa transition-all"
            placeholder={getPlaceholder()}
          />
        </div>
      </div>
    </header>
  );
};