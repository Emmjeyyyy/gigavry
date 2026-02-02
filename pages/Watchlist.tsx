import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WatchlistItem } from '../types';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';

interface WatchlistProps {
  searchTerm: string;
}

export const Watchlist: React.FC<WatchlistProps> = ({ searchTerm }) => {
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('gigagivry_watchlist', []);
  const [showConfirm, setShowConfirm] = useState(false);

  const filteredItems = watchlist.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const games = filteredItems.filter(i => i.type === 'game');
  const giveaways = filteredItems.filter(i => i.type === 'giveaway');

  const removeAll = () => {
    setWatchlist([]);
    setShowConfirm(false);
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(i => i.id !== id));
  };

  const ItemRow = ({ item }: { item: WatchlistItem }) => (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-givry/80 border border-cocoa/10 p-4 rounded-xl transition-all hover:bg-givry hover:shadow-md hover:border-cocoa/30 group">
      <div className="w-full sm:w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-grow text-center sm:text-left">
        <h4 className="font-bold text-lg text-cocoa leading-tight">{item.title}</h4>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
          <Badge label={item.platform} variant="outline" className="text-xs" />
          <span className="text-xs text-cocoa/60 font-mono">
            {item.subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          to={item.type === 'game' ? `/free-games/${item.id}` : `/giveaways/${item.id}`}
          className="text-sm font-bold text-thatch hover:text-cocoa uppercase font-mono"
        >
          View
        </Link>
        <button 
          onClick={() => removeFromWatchlist(item.id)}
          className="p-2 text-cocoa/40 hover:text-red-500 transition-colors"
          title="Remove"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-givry/20 p-4 rounded-xl border border-cocoa/10">
        <h2 className="text-2xl font-black text-cocoa tracking-tight">Tracked Items</h2>
        {watchlist.length > 0 && (
          <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200" onClick={() => setShowConfirm(true)}>
            Clear Data
          </Button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
          <div className="w-16 h-16 border-2 border-dashed border-cocoa rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">0</span>
          </div>
          <p className="font-mono text-lg">Watchlist empty. Initiate tracking.</p>
        </div>
      ) : (
        <>
          {games.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-thatch uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-thatch rounded-full"></span>
                Games ({games.length})
              </h3>
              <div className="space-y-3">
                {games.map(item => <ItemRow key={item.id} item={item} />)}
              </div>
            </section>
          )}

          {giveaways.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-thatch uppercase tracking-widest mb-4 mt-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-thatch rounded-full"></span>
                Giveaways ({giveaways.length})
              </h3>
              <div className="space-y-3">
                {giveaways.map(item => <ItemRow key={item.id} item={item} />)}
              </div>
            </section>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/40 backdrop-blur-sm">
          <div className="bg-givry border-2 border-cocoa rounded-xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2">Confirm Purge?</h3>
            <p className="text-cocoa/70 mb-6">This will remove all tracked items from local storage.</p>
            <div className="flex gap-4">
              <Button onClick={removeAll} className="bg-red-500 border-red-500 text-white hover:text-red-500">Yes, Purge</Button>
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};