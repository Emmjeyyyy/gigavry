import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GamerPowerService } from '../services/api';
import { Giveaway } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WatchlistItem } from '../types';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { SkeletonGiveawayDetail } from '../components/UI/Loader';
import { ImageModal } from '../components/UI/ImageModal';

export const GiveawayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const giveawayId = Number(id);

  const [giveaway, setGiveaway] = useState<Giveaway | null>(() => {
    return GamerPowerService.getGiveawayDetailsSync(giveawayId);
  });
  const [loading, setLoading] = useState(() => !GamerPowerService.getGiveawayDetailsSync(giveawayId));
  
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('gigagivry_watchlist', []);
  const inWatchlist = watchlist.some(i => i.id === giveawayId);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchGiveaway = async () => {
      const cached = GamerPowerService.getGiveawayDetailsSync(giveawayId);
      if (cached) {
        setGiveaway(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await GamerPowerService.getGiveawayDetails(giveawayId);
        setGiveaway(data);
      } catch (err) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchGiveaway();
  }, [id, giveawayId]);

  const toggleWatchlist = () => {
    if (!giveaway) return;
    if (inWatchlist) {
      setWatchlist(prev => prev.filter(i => i.id !== giveaway.id));
    } else {
      setWatchlist(prev => [...prev, {
        id: giveaway.id,
        type: 'giveaway',
        title: giveaway.title,
        thumbnail: giveaway.thumbnail,
        subtitle: giveaway.worth,
        platform: giveaway.platforms,
        addedAt: Date.now()
      }]);
    }
  };

  if (loading) return <SkeletonGiveawayDetail />;
  if (!giveaway) return <div className="text-center py-20">Giveaway not found.</div>;

  return (
    <div className="animate-fade-in pb-12">
      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageSrc={selectedImage}
        altText={giveaway.title}
      />

      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:translate-x-[-2px]">
          ← Back to Giveaways
        </Button>
      </div>

      <div className="bg-givry border border-cocoa/20 rounded-2xl overflow-hidden">
        <div 
          className="relative h-64 md:h-80 w-full cursor-zoom-in group"
          onClick={() => setSelectedImage(giveaway.image)}
        >
          <img 
            src={giveaway.image} 
            alt={giveaway.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
          />
          <div className="absolute bottom-0 inset-x-0 h-full bg-gradient-to-t from-cocoa via-cocoa/60 to-transparent flex items-end p-6 md:p-10 pointer-events-none">
            <div className="relative z-10 w-full">
               <div className="flex gap-2 mb-3">
                 <Badge label={giveaway.type} variant="secondary" />
                 <Badge label={giveaway.status} className="bg-green-500 text-white border-green-600" />
               </div>
               <h1 className="text-3xl md:text-5xl font-black text-givry tracking-tight leading-tight">
                 {giveaway.title}
               </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-cocoa/10">
          <div className="col-span-2 p-6 md:p-10 space-y-8">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-thatch mb-2 font-bold">About this drop</h3>
              <p className="text-lg text-cocoa/80 leading-relaxed">{giveaway.description}</p>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-thatch mb-4 font-bold">Instructions</h3>
              <div className="bg-white/50 p-6 rounded-xl border border-cocoa/10 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {giveaway.instructions}
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-cocoa/5 p-6 md:p-10 flex flex-col gap-6">
            <div className="text-center mb-4">
              <span className="block text-sm font-mono text-cocoa/60 mb-1">Estimated Value</span>
              <span className="text-4xl font-black text-thatch">{giveaway.worth === 'N/A' ? 'FREE' : giveaway.worth}</span>
            </div>

            <a href={giveaway.open_giveaway_url} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button className="w-full text-lg animate-pulse-slow">CLAIM GIVEAWAY</Button>
            </a>

            <Button 
              variant={inWatchlist ? "secondary" : "ghost"} 
              className={`w-full ${inWatchlist ? 'bg-cocoa text-givry' : 'bg-white/50'}`}
              onClick={toggleWatchlist}
            >
              {inWatchlist ? 'Tracked in Watchlist' : 'Add to Watchlist'}
            </Button>

            <div className="mt-auto space-y-4 text-sm border-t border-cocoa/10 pt-6">
              <div className="flex justify-between">
                <span className="text-cocoa/60">Platform</span>
                <span className="font-bold text-right">{giveaway.platforms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa/60">Published</span>
                <span className="font-bold">{new Date(giveaway.published_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa/60">Ends</span>
                <span className="font-bold text-thatch">{giveaway.end_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};