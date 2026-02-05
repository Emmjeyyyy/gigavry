import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const gameId = Number(id);

  const [game, setGame] = useState<GameDetail | null>(() => {
    return FreeToGameService.getGameDetailsSync(gameId);
  });
  const [loading, setLoading] = useState(() => !FreeToGameService.getGameDetailsSync(gameId));
  
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('gigagivry_watchlist', []);
  const inWatchlist = watchlist.some(i => i.id === gameId);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchGame = async () => {
      const cached = FreeToGameService.getGameDetailsSync(gameId);
      if (cached) {
        setGame(cached);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await FreeToGameService.getGameDetails(gameId);
        setGame(data);
      } catch (err) {
        // Fallback or error handling
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
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

  if (loading) return <SkeletonGameDetail />;
  if (!game) return <div className="text-center py-20">Game not found.</div>;

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
            className="rounded-xl overflow-hidden border-2 border-cocoa cursor-zoom-in group"
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
              <span className="font-bold">{game.status}</span>
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
            <p className="text-xl text-cocoa/80 font-light leading-relaxed">{game.description}</p>
          </div>

          {game.screenshots && game.screenshots.length > 0 && (
            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-thatch mb-4 font-bold">Visuals</h3>
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
            </div>
          )}

          {game.minimum_system_requirements && (
            <div className="bg-cocoa text-givry p-6 rounded-xl relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="font-mono text-sm uppercase tracking-widest text-thatch mb-4 font-bold border-b border-thatch/30 pb-2">System Specs (Min)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm font-mono">
                   <div>
                     <span className="block text-thatch text-xs">OS</span>
                     <span>{game.minimum_system_requirements.os}</span>
                   </div>
                   <div>
                     <span className="block text-thatch text-xs">Processor</span>
                     <span>{game.minimum_system_requirements.processor}</span>
                   </div>
                   <div>
                     <span className="block text-thatch text-xs">Memory</span>
                     <span>{game.minimum_system_requirements.memory}</span>
                   </div>
                   <div>
                     <span className="block text-thatch text-xs">Graphics</span>
                     <span>{game.minimum_system_requirements.graphics}</span>
                   </div>
                   <div className="md:col-span-2">
                     <span className="block text-thatch text-xs">Storage</span>
                     <span>{game.minimum_system_requirements.storage}</span>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};