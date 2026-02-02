import React, { useState } from 'react';
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

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

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