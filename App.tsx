import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import { TopNav } from './components/Layout/TopNav';
import { ScrollToTop } from './components/Layout/ScrollToTop';
import { FreeGames } from './pages/FreeGames';
import { Giveaways } from './pages/Giveaways';
import { Watchlist } from './pages/Watchlist';
import { GameDetailPage } from './pages/GameDetail';
import { GiveawayDetailPage } from './pages/GiveawayDetail';
import { useDebounce } from './hooks/useDebounce';
import { FreeToGameService, GamerPowerService } from './services/api';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    // Prefetch default data for both main views on mount to ensure instant navigation
    // Using default params matches the initial state of the pages
    const prefetchData = async () => {
      try {
        // Parallel fetch for efficiency
        // Service layer handles deduplication if pages are already fetching
        await Promise.allSettled([
          FreeToGameService.getGames({ sort: 'relevance' }),
          GamerPowerService.getGiveaways({ sort: 'date' })
        ]);
      } catch (error) {
        console.warn('Background prefetch encountered an error', error);
      }
    };
    prefetchData();
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <AppShell>
        <TopNav searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <Routes>
          <Route path="/" element={<Navigate to="/free-games" replace />} />
          
          <Route 
            path="/free-games" 
            element={<FreeGames searchTerm={debouncedSearch} />} 
          />
          <Route path="/free-games/:id" element={<GameDetailPage />} />
          
          <Route 
            path="/giveaways" 
            element={<Giveaways searchTerm={debouncedSearch} />} 
          />
          <Route path="/giveaways/:id" element={<GiveawayDetailPage />} />
          
          <Route 
            path="/watchlist" 
            element={<Watchlist searchTerm={debouncedSearch} />} 
          />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}

export default App;