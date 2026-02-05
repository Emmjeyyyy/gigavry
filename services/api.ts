import { API_BASE, CORS_PROXIES } from '../constants';
import { FreeGame, GameDetail, Giveaway } from '../types';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const STORAGE_PREFIX = 'gigagivry_api_v1_';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

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
  const now = Date.now();
  
  // 1. Check Memory Cache
  const memoryEntry = cache.get(key);
  if (memoryEntry) {
    if (now - memoryEntry.timestamp <= CACHE_TTL) {
      return memoryEntry.data;
    }
    cache.delete(key);
  }

  // 2. Check Persistent Storage
  try {
    const storageKey = STORAGE_PREFIX + key;
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed: CacheEntry<T> = JSON.parse(stored);
      // Valid TTL?
      if (now - parsed.timestamp <= CACHE_TTL) {
        // Hydrate memory cache for faster subsequent access
        cache.set(key, parsed);
        return parsed.data;
      } else {
        // Expired, clean up
        window.localStorage.removeItem(storageKey);
      }
    }
  } catch (error) {
    console.warn('Cache read failed:', error);
  }
  
  return null;
};

const setCache = <T>(key: string, data: T) => {
  const entry = {
    data,
    timestamp: Date.now(),
  };
  
  // Update Memory
  cache.set(key, entry);
  
  // Update Storage
  try {
    const storageKey = STORAGE_PREFIX + key;
    window.localStorage.setItem(storageKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('Cache write failed (storage quota?):', error);
  }
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

// Helper to handle caching and in-flight deduplication
const fetchWithCache = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  // 1. Check Cache (Memory + Disk)
  const cached = getFromCache<T>(key);
  if (cached) return cached;

  // 2. Check In-Flight
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  // 3. Fetch
  const promise = fetcher()
    .then((data) => {
      setCache(key, data);
      inFlightRequests.delete(key);
      return data;
    })
    .catch((error) => {
      inFlightRequests.delete(key);
      throw error;
    });

  inFlightRequests.set(key, promise);
  return promise;
};

export const FreeToGameService = {
  getGamesSync: (params: { platform?: string; category?: string; sort?: string } = {}): FreeGame[] | null => {
    const key = getCacheKey('games', params);
    return getFromCache<FreeGame[]>(key);
  },

  getGames: async (params: { platform?: string; category?: string; sort?: string } = {}): Promise<FreeGame[]> => {
    const key = getCacheKey('games', params);
    
    const query = new URLSearchParams();
    if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.sort) query.append('sort-by', params.sort);
    
    const queryString = query.toString();
    const url = `${API_BASE.FREETOGAME}/games${queryString ? `?${queryString}` : ''}`;
    
    return fetchWithCache<FreeGame[]>(key, () => fetchWithProxy(url));
  },

  getGameDetailsSync: (id: number): GameDetail | null => {
    const key = getCacheKey('game_details', { id });
    return getFromCache<GameDetail>(key);
  },

  getGameDetails: async (id: number): Promise<GameDetail> => {
    const key = getCacheKey('game_details', { id });
    const url = `${API_BASE.FREETOGAME}/game?id=${id}`;
    return fetchWithCache<GameDetail>(key, () => fetchWithProxy(url));
  }
};

export const GamerPowerService = {
  getGiveawaysSync: (params: { platform?: string; type?: string; sort?: string } = {}): Giveaway[] | null => {
    const key = getCacheKey('giveaways', params);
    return getFromCache<Giveaway[]>(key);
  },

  getGiveaways: async (params: { platform?: string; type?: string; sort?: string } = {}): Promise<Giveaway[]> => {
    const key = getCacheKey('giveaways', params);

    const query = new URLSearchParams();
    if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.sort) query.append('sort-by', params.sort);

    const queryString = query.toString();
    const url = `${API_BASE.GAMERPOWER}/giveaways${queryString ? `?${queryString}` : ''}`;
    
    return fetchWithCache<Giveaway[]>(key, () => fetchWithProxy(url));
  },

  getGiveawayDetailsSync: (id: number): Giveaway | null => {
    const key = getCacheKey('giveaway_details', { id });
    return getFromCache<Giveaway>(key);
  },

  getGiveawayDetails: async (id: number): Promise<Giveaway> => {
    const key = getCacheKey('giveaway_details', { id });
    const url = `${API_BASE.GAMERPOWER}/giveaway?id=${id}`;
    return fetchWithCache<Giveaway>(key, () => fetchWithProxy(url));
  }
};