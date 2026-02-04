import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GamerPowerService } from '../services/api';
import { Giveaway, FilterState } from '../types';
import { GiveawayCard } from '../components/Cards/GiveawayCard';
import { SkeletonCard } from '../components/UI/Loader';
import { Pagination } from '../components/UI/Pagination';
import { GIVEAWAY_TYPES, PLATFORMS, SORT_OPTIONS } from '../constants';

interface GiveawaysProps {
  searchTerm: string;
}

const ITEMS_PER_PAGE = 12;

export const Giveaways: React.FC<GiveawaysProps> = ({ searchTerm }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = useMemo(() => ({
    platform: searchParams.get('platform') || 'all',
    type: searchParams.get('type') || 'all',
    sort: searchParams.get('sort') || 'date'
  }), [searchParams]);

  const [giveaways, setGiveaways] = useState<Giveaway[]>(() => {
    return GamerPowerService.getGiveawaysSync({
      platform: filters.platform === 'all' ? undefined : filters.platform,
      type: filters.type === 'all' ? undefined : filters.type,
      sort: filters.sort
    }) || [];
  });

  const [loading, setLoading] = useState(() => {
    return !GamerPowerService.getGiveawaysSync({
      platform: filters.platform === 'all' ? undefined : filters.platform,
      type: filters.type === 'all' ? undefined : filters.type,
      sort: filters.sort
    });
  });

  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchGiveaways = async () => {
      const apiParams = {
        platform: filters.platform === 'all' ? undefined : filters.platform,
        type: filters.type === 'all' ? undefined : filters.type,
        sort: filters.sort
      };

      const cached = GamerPowerService.getGiveawaysSync(apiParams);
      if (cached) {
        if (isMounted) {
          setGiveaways(cached);
          setLoading(false);
          setError(null);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }
      
      try {
        const data = await GamerPowerService.getGiveaways(apiParams);
        if (isMounted) setGiveaways(data);
      } catch (err) {
        if (isMounted) setError('Signal lost. Failed to retrieve giveaway data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGiveaways();
    return () => { isMounted = false; };
  }, [filters]);

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

  const filteredGiveaways = giveaways.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGiveaways.length / ITEMS_PER_PAGE);
  const displayedGiveaways = filteredGiveaways.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 bg-givry/50 p-4 rounded-xl border border-cocoa/10 backdrop-blur-sm shadow-none hover:shadow-none">
        <select 
          value={filters.platform}
          onChange={(e) => updateFilter('platform', e.target.value)}
          className="bg-white/50 border border-cocoa/20 rounded-lg px-3 py-2 text-sm text-cocoa focus:ring-2 focus:ring-cocoa/20 focus:outline-none"
        >
          {PLATFORMS.GIVEAWAYS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>

        <select 
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="bg-white/50 border border-cocoa/20 rounded-lg px-3 py-2 text-sm text-cocoa focus:ring-2 focus:ring-cocoa/20 focus:outline-none"
        >
          {GIVEAWAY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <select 
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="bg-white/50 border border-cocoa/20 rounded-lg px-3 py-2 text-sm text-cocoa focus:ring-2 focus:ring-cocoa/20 focus:outline-none lg:ml-auto"
        >
          {SORT_OPTIONS.GIVEAWAYS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {error ? (
        <div className="text-center py-20 bg-givry/20 rounded-xl border border-cocoa/10">
          <p className="text-cocoa font-mono text-lg mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-thatch underline font-bold hover:text-gigas">Retry Connection</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredGiveaways.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-cocoa/60 font-mono text-lg">No drops detected. Try loosening filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedGiveaways.map(g => (
              <GiveawayCard key={g.id} giveaway={g} searchHighlight={searchTerm} />
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