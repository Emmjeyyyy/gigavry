
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FreeToGameService } from '../services/api';
import { GameDetail } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WatchlistItem } from '../types';
import { Button } from '../components/UI/Button';
import { SkeletonGameDetail } from '../components/UI/Loader';
import { ImageModal } from '../components/UI/ImageModal';

export const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = Number(id);

  // Initialize with cached data (full details) or location state (partial list data)
  const [game, setGame] = useState<GameDetail | null>(() => {
    const cached = FreeToGameService.getGameDetailsSync(gameId);
    if (cached) return cached;
    if (location.state?.game && location.state.game.id === gameId) {
      return location.state.game as GameDetail;
    }
    return null;
  });

  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('gigagivry_watchlist', []);
  const inWatchlist = watchlist.some(i => i.id === gameId);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // If we don't have the full description yet, we are still "loading" the details
  // even if we have displayed the partial data.
  const [loading, setLoading] = useState(() => !FreeToGameService.getGameDetailsSync(gameId));

  useEffect(() => {
    if (!id) return;
    
    // Check sync cache again to handle back navigation updates
    const cached = FreeToGameService.getGameDetailsSync(gameId);
    if (cached) {
      setGame(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    FreeToGameService.getGameDetails(gameId)
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, gameId]);

  const toggleWatchlist = () => {
    if (!game) return;
    if (inWatchlist) {
      setWatchlist(prev => prev.filter(i => i.id !== game.id));
    } else {
      setWatchlist(prev => [...prev, {
        id: game.id,
        type: 'game',
        title: game.title,
        thumbnail: game.thumbnail,
        subtitle: game.genre,
        platform: game.platform,
        addedAt: Date.now()
      }]);
    }
  };

  const shareGame = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  // Only show full page skeleton if we have absolutely no data (direct link visit + slow network)
  if (!game) return <SkeletonGameDetail />;

  return (
    <div className="animate-fade-in pb-12">
      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageSrc={selectedImage}
        altText={game.title}
      />

      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:translate-x-[-2px]">
          ← Back to Games
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Media */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            className="rounded-xl overflow-hidden border-2 border-cocoa cursor-zoom-in group bg-givry/20"
            onClick={() => setSelectedImage(game.thumbnail)}
          >
            <img 
              src={game.thumbnail} 
              alt={game.title} 
              className="w-full transition-transform duration-500 group-hover:scale-[1.02]" 
            />
          </div>
          
          <div className="space-y-4">
            <a href={game.game_url} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full text-lg">PLAY NOW</Button>
            </a>
            
            <div className="flex gap-2">
              <Button 
                variant={inWatchlist ? "secondary" : "ghost"} 
                className={`flex-1 ${inWatchlist ? 'bg-cocoa text-givry border-cocoa' : 'border-cocoa'}`}
                onClick={toggleWatchlist}
              >
                {inWatchlist ? 'Tracked' : 'Watch'}
              </Button>
              <Button variant="ghost" className="flex-1 border-cocoa" onClick={shareGame}>
                Share
              </Button>
            </div>
          </div>

          <div className="bg-givry/50 p-6 rounded-xl border border-cocoa/10 text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-cocoa/60">Status</span>
              {game.status ? (
                <span className="font-bold">{game.status}</span>
              ) : (
                <div className="h-5 w-16 bg-cocoa/10 rounded animate-pulse" />
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-cocoa/60">Platform</span>
              <span className="font-bold text-right">{game.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cocoa/60">Genre</span>
              <span className="font-bold">{game.genre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cocoa/60">Publisher</span>
              <span className="font-bold text-right">{game.publisher}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cocoa/60">Release</span>
              <span className="font-bold">{game.release_date}</span>
            </div>
          </div>
        </div>

        {/* Right Col - Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-givry p-8 rounded-2xl border border-cocoa/10">
            <h1 className="text-4xl font-black text-cocoa mb-4 tracking-tight">{game.title}</h1>
            <div className="text-xl text-cocoa/80 font-light leading-relaxed">
              {game.description ? (
                game.description
              ) : (
                <>
                  <p>{game.short_description}</p>
                  <div className="space-y-2 mt-6 opacity-60 animate-pulse">
                    <div className="h-4 bg-cocoa/10 rounded w-full" />
                    <div className="h-4 bg-cocoa/10 rounded w-full" />
                    <div className="h-4 bg-cocoa/10 rounded w-2/3" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-thatch mb-4 font-bold">Visuals</h3>
            {game.screenshots && game.screenshots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {game.screenshots.slice(0, 4).map(shot => (
                  <img 
                    key={shot.id} 
                    src={shot.image} 
                    alt="Screenshot" 
                    className="rounded-lg border border-cocoa/20 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
                    onClick={() => setSelectedImage(shot.image)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                {[1, 2].map(i => (
                   <div key={i} className="aspect-video bg-cocoa/5 rounded-lg border border-cocoa/5" />
                ))}
              </div>
            )}
          </div>

          <div className="bg-cocoa text-givry p-6 rounded-xl relative overflow-hidden min-h-[200px]">
             {game.minimum_system_requirements ? (
               <div className="relative z-10">
                 <h3 className="font-mono text-sm uppercase tracking-widest text-thatch mb-4 font-bold border-b border-thatch/30 pb-2">System Specs (Min)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm font-mono">
                   <div>
                     <span className="block text-thatch text-xs">OS</span>
                     <span>{game.minimum_system_requirements.os || 'N/A'}</span>
                   </div>
                   <div>
                     <span className="block text-thatch text-xs">Processor</span>
                     <span>{game.minimum_system_requirements.processor || 'N/A'}</span>
                   </div>
                   <div>
                     <span className="block text-thatch text-xs">Memory</span>
                     <span>{game.minimum_system_requirements.memory || 'N/A'}</span>
                   </div>
                   <div>
                     <span className="block text-thatch text-xs">Graphics</span>
                     <span>{game.minimum_system_requirements.graphics || 'N/A'}</span>
                   </div>
                   <div className="md:col-span-2">
                     <span className="block text-thatch text-xs">Storage</span>
                     <span>{game.minimum_system_requirements.storage || 'N/A'}</span>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="relative z-10 animate-pulse space-y-4">
                 <div className="h-6 w-32 bg-white/10 rounded" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-white/10 rounded" />)}
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};