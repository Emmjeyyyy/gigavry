
import React from 'react';
import { Link } from 'react-router-dom';
import { Giveaway } from '../../types';
import { Badge } from '../UI/Badge';

interface GiveawayCardProps {
  giveaway: Giveaway;
  searchHighlight?: string;
}

export const GiveawayCard: React.FC<GiveawayCardProps> = ({ giveaway, searchHighlight }) => {
  const isExpired = giveaway.status === 'Active' ? false : true;

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
    <Link to={`/giveaways/${giveaway.id}`} className={`group block h-full perspective-1000 relative isolate ${isExpired ? 'opacity-60 grayscale' : ''}`}>
      <article className="h-full bg-givry border border-cocoa rounded-xl overflow-hidden transition-all duration-300 ease-out transform-gpu will-change-transform
        shadow-[0_2px_0_0_rgba(70,24,40,0.05)]
        group-hover:-translate-y-[2px] 
        group-hover:shadow-[0_0_20px_rgba(247,238,198,0.5)] 
        flex flex-col relative">
        
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={giveaway.thumbnail} 
            alt={giveaway.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] will-change-transform"
            loading="lazy"
          />
          <div className="absolute top-2 left-2">
            <Badge 
              label={giveaway.worth === 'N/A' ? 'FREE' : giveaway.worth} 
              variant="secondary" 
              className="shadow-[0_2px_0_rgba(70,24,40,0.1)] !bg-gigas !border-gigas" 
            />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-cocoa/80 to-transparent p-4 flex items-end">
            <div className="text-givry text-xs font-mono drop-shadow-[0_1px_1px_rgba(70,24,40,0.5)]">
              {giveaway.type}
            </div>
          </div>
          {/* Inner vignette */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-t-xl pointer-events-none" />
        </div>
        
        <div className="p-4 flex flex-col flex-grow relative z-10">
          <h3 className="font-bold text-lg leading-tight text-cocoa mb-2 line-clamp-2 group-hover:text-gigas transition-colors drop-shadow-sm">
            <HighlightedText text={giveaway.title} />
          </h3>
          
          <p className="text-sm text-cocoa/70 mb-4 line-clamp-2 flex-grow">
            {giveaway.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-cocoa/10">
             {giveaway.platforms.split(',').slice(0, 2).map(p => (
               <Badge key={p} label={p.trim()} variant="outline" className="text-[9px]" />
             ))}
             {giveaway.platforms.split(',').length > 2 && (
               <span className="text-xs text-cocoa/50 self-center">+ more</span>
             )}
          </div>
          
          {giveaway.end_date && giveaway.end_date !== 'N/A' && (
             <div className="mt-2 text-xs font-mono text-thatch flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-thatch animate-pulse"></span>
               Ends: {new Date(giveaway.end_date).toLocaleDateString()}
             </div>
          )}
        </div>
      </article>
    </Link>
  );
};
