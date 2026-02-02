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
    `relative px-4 py-2 font-mono font-bold uppercase tracking-wider text-sm transition-all duration-200 
    ${isActive 
      ? 'text-cocoa bg-givry shadow-[2px_2px_0px_0px_rgba(70,24,40,0.15)] border border-cocoa translate-y-[-1px] rounded-md' 
      : 'text-cocoa/60 hover:text-cocoa hover:bg-givry/50 rounded-md'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full mb-8 pt-4 pb-2">
      <div className="bg-givry/90 backdrop-blur-md border border-cocoa/20 rounded-2xl shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-gigas"></div>
            <div className="w-3 h-3 rounded-full bg-givry border border-cocoa"></div>
            <div className="w-3 h-3 rounded-full bg-cocoa"></div>
            <div className="w-3 h-3 rounded-full bg-thatch"></div>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-cocoa">
            GIGA<span className="text-thatch">GIVRY</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 p-1 bg-cocoa/5 rounded-lg overflow-x-auto max-w-full">
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
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-cocoa/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-cocoa/20 rounded-lg leading-5 bg-white/50 placeholder-cocoa/40 focus:outline-none focus:ring-2 focus:ring-cocoa/20 focus:border-cocoa text-sm font-mono text-cocoa transition-all"
            placeholder={getPlaceholder()}
          />
        </div>
      </div>
    </header>
  );
};