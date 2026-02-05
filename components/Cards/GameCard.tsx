
import React from 'react';
import { Link } from 'react-router-dom';
import { FreeGame } from '../../types';
import { Badge } from '../UI/Badge';

interface GameCardProps {
  game: FreeGame;
  searchHighlight?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ game, searchHighlight }) => {
  const HighlightedText = ({ text }: { text: string }) => {
    if (!searchHighlight) return <>{text}</>;
    const parts = text.split(new RegExp(`(${searchHighlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchHighlight.toLowerCase() ? 
            <span key={i} className="bg-thatch/30 text-cocoa font-bold rounded px-0.5">{part}</span> : part
        )}
      </>
    );
  };

  return (
    <Link to={`/free-games/${game.id}`} className="group block h-full perspective-1000 relative isolate">
      <article className="h-full bg-givry border border-cocoa rounded-xl overflow-hidden transition-all duration-300 ease-out transform-gpu will-change-transform
        group-hover:-translate-y-[2px] group-hover:shadow-[0_0_15px_#e6ddc2]
        flex flex-col relative">
        
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={game.thumbnail} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] will-change-transform"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge 
              label={game.platform === 'PC (Windows)' ? 'PC' : 'WEB'} 
              variant="primary" 
            />
          </div>
          {/* Inner vignette for depth */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-t-xl pointer-events-none" />
        </div>
        
        <div className="p-4 flex flex-col flex-grow relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg leading-tight text-cocoa line-clamp-1 group-hover:text-gigas transition-colors">
              <HighlightedText text={game.title} />
            </h3>
          </div>
          
          <p className="text-sm text-cocoa/70 mb-4 line-clamp-2 flex-grow">
            {game.short_description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-cocoa/10">
            <Badge label={game.genre} variant="outline" />
            <span className="text-xs font-mono text-cocoa/50">{game.publisher}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};