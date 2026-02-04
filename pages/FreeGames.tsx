import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FreeToGameService } from '../services/api';
import { FreeGame, FilterState } from '../types';
import { GameCard } from '../components/Cards/GameCard';
import { SkeletonCard } from '../components/UI/Loader';
import { Pagination } from '../components/UI/Pagination';
import { GAME_CATEGORIES, PLATFORMS, SORT_OPTIONS } from '../constants';

interface FreeGamesProps {
  searchTerm: string;
}

const ITEMS_PER_PAGE = 12;

export const FreeGames: React.FC<FreeGamesProps> = ({ searchTerm }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Memoize filters to prevent object instability
  const filters: FilterState = useMemo(() => ({
    platform: searchParams.get('platform') || 'all',
    category: searchParams.get('category') || 'all',
    sort: searchParams.get('sort') || 'relevance'
  }), [searchParams]);

  // Initialize with cached data if available to prevent initial flash
  const [games, setGames] = useState<FreeGame[]>(() => {
    return FreeToGameService.getGamesSync({
      platform: filters.platform === 'all' ? undefined : filters.platform,
      category: filters.category === 'all' ? undefined : filters.category,
      sort: filters.sort
    }) || [];
  });

  const [loading, setLoading] = useState(() => {
    const cached = FreeToGameService.getGamesSync({
      platform: filters.platform === 'all' ? undefined : filters.platform,
      category: filters.category === 'all' ? undefined : filters.category,
      sort: filters.sort
    });
    return !cached;
  });

  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    
    const fetchGames = async () => {
      // Prepare API params
      const apiParams = {
        platform: filters.platform === 'all' ? undefined : filters.platform,
        category: filters.category === 'all' ? undefined : filters.category,
        sort: filters.sort
      };

      // Check cache first to avoid setting loading=true if data is ready
      const cached = FreeToGameService.getGamesSync(apiParams);
      if (cached) {
        if (isMounted) {
          setGames(cached);
          setLoading(false);
          setError(null);
        }
        // Even if cached, we could optionally trigger a background re-validate here if needed,
        // but requirements say only fetch if expired.
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await FreeToGameService.getGames(apiParams);
        if (isMounted) setGames(data);
      } catch (err) {
        if (isMounted) setError('Signal lost. Failed to retrieve game data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGames();
    return () => { isMounted = false; };
  }, [filters]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const displayedGames = filteredGames.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 bg-givry/50 p-4 rounded-xl border border-cocoa/10 backdrop-blur-sm shadow-none hover:shadow-none">
        <select 
          value={filters.platform}
          onChange={(e) => updateFilter('platform', e.target.value)}
          className="bg-white/50 border border-cocoa/20 rounded-lg px-3 py-2 text-sm text-cocoa focus:ring-2 focus:ring-cocoa/20 focus:outline-none"
        >
          {PLATFORMS.GAMES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>

        <select 
          value={filters.category || 'all'}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="bg-white/50 border border-cocoa/20 rounded-lg px-3 py-2 text-sm text-cocoa focus:ring-2 focus:ring-cocoa/20 focus:outline-none capitalize"
        >
          <option value="all">All Genres</option>
          {GAME_CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
        </select>

        <select 
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="bg-white/50 border border-cocoa/20 rounded-lg px-3 py-2 text-sm text-cocoa focus:ring-2 focus:ring-cocoa/20 focus:outline-none lg:ml-auto"
        >
          {SORT_OPTIONS.GAMES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Content */}
      {error ? (
        <div className="text-center py-20 bg-givry/20 rounded-xl border border-cocoa/10">
          <p className="text-cocoa font-mono text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-thatch underline font-bold hover:text-gigas"
          >
            Retry Connection
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-cocoa/60 font-mono text-lg">No drops detected. Try loosening filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedGames.map(game => (
              <GameCard key={game.id} game={game} searchHighlight={searchTerm} />
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};