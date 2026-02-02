import { API_BASE, CORS_PROXIES } from '../constants';
import { FreeGame, GameDetail, Giveaway } from '../types';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<any>>();

// Helper to generate consistent keys from objects
const getCacheKey = (prefix: string, params: any = {}) => {
  if (typeof params !== 'object' || params === null) {
    return `${prefix}_${String(params)}`;
  }
  // Sort keys to ensure {a:1, b:2} generates same key as {b:2, a:1}
  const sortedKeys = Object.keys(params).sort();
  const sortedParams = sortedKeys.reduce((acc, key) => {
    acc[key] = params[key];
    return acc;
  }, {} as any);
  return `${prefix}_${JSON.stringify(sortedParams)}`;
};

const getFromCache = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
};

const setCache = <T>(key: string, data: T) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const fetchWithProxy = async (url: string) => {
  let lastError: any;

  // Try proxies in order until one succeeds
  for (const proxyBase of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxyBase}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.warn(`Proxy attempt failed (${proxyBase}):`, error);
      lastError = error;
    }
  }

  console.error('All proxies failed. Last error:', lastError);
  throw lastError || new Error('Signal lost: Unable to reach game servers via any proxy.');
};

export const FreeToGameService = {
  getGamesSync: (params: { platform?: string; category?: string; sort?: string } = {}): FreeGame[] | null => {
    const key = getCacheKey('games', params);
    return getFromCache<FreeGame[]>(key);
  },

  getGames: async (params: { platform?: string; category?: string; sort?: string } = {}): Promise<FreeGame[]> => {
    const key = getCacheKey('games', params);
    const cached = getFromCache<FreeGame[]>(key);
    if (cached) return cached;

    const query = new URLSearchParams();
    if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.sort) query.append('sort-by', params.sort);
    
    const queryString = query.toString();
    const url = `${API_BASE.FREETOGAME}/games${queryString ? `?${queryString}` : ''}`;
    
    const data = await fetchWithProxy(url);
    setCache(key, data);
    return data;
  },

  getGameDetailsSync: (id: number): GameDetail | null => {
    const key = getCacheKey('game_details', { id });
    return getFromCache<GameDetail>(key);
  },

  getGameDetails: async (id: number): Promise<GameDetail> => {
    const key = getCacheKey('game_details', { id });
    const cached = getFromCache<GameDetail>(key);
    if (cached) return cached;

    const url = `${API_BASE.FREETOGAME}/game?id=${id}`;
    const data = await fetchWithProxy(url);
    setCache(key, data);
    return data;
  }
};

export const GamerPowerService = {
  getGiveawaysSync: (params: { platform?: string; type?: string; sort?: string } = {}): Giveaway[] | null => {
    const key = getCacheKey('giveaways', params);
    return getFromCache<Giveaway[]>(key);
  },

  getGiveaways: async (params: { platform?: string; type?: string; sort?: string } = {}): Promise<Giveaway[]> => {
    const key = getCacheKey('giveaways', params);
    const cached = getFromCache<Giveaway[]>(key);
    if (cached) return cached;

    const query = new URLSearchParams();
    if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.sort) query.append('sort-by', params.sort);

    const queryString = query.toString();
    const url = `${API_BASE.GAMERPOWER}/giveaways${queryString ? `?${queryString}` : ''}`;
    
    const data = await fetchWithProxy(url);
    setCache(key, data);
    return data;
  },

  getGiveawayDetailsSync: (id: number): Giveaway | null => {
    const key = getCacheKey('giveaway_details', { id });
    return getFromCache<Giveaway>(key);
  },

  getGiveawayDetails: async (id: number): Promise<Giveaway> => {
    const key = getCacheKey('giveaway_details', { id });
    const cached = getFromCache<Giveaway>(key);
    if (cached) return cached;

    const url = `${API_BASE.GAMERPOWER}/giveaway?id=${id}`;
    const data = await fetchWithProxy(url);
    setCache(key, data);
    return data;
  }
};