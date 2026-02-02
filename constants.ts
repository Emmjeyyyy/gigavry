export const API_BASE = {
  FREETOGAME: 'https://www.freetogame.com/api',
  GAMERPOWER: 'https://www.gamerpower.com/api',
};

// Using multiple CORS proxies to ensure reliability. 
// If one fails (rate limit, downtime), the service will try the next.
export const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?url=',
];

export const SORT_OPTIONS = {
  GAMES: [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Date Added', value: 'date' },
    { label: 'Popularity', value: 'popularity' },
    { label: 'Alphabetical', value: 'alphabetical' },
    { label: 'Release Date', value: 'release-date' },
  ],
  GIVEAWAYS: [
    { label: 'Date Added', value: 'date' },
    { label: 'Value', value: 'value' },
    { label: 'Popularity', value: 'popularity' },
  ]
};

export const PLATFORMS = {
  GAMES: [
    { label: 'All Platforms', value: 'all' },
    { label: 'PC (Windows)', value: 'pc' },
    { label: 'Browser', value: 'browser' },
  ],
  GIVEAWAYS: [
    { label: 'All', value: 'all' },
    { label: 'PC', value: 'pc' },
    { label: 'Steam', value: 'steam' },
    { label: 'Epic Games', value: 'epic-games-store' },
    { label: 'Ubisoft', value: 'ubisoft' },
    { label: 'GOG', value: 'gog' },
    { label: 'Itch.io', value: 'itchio' },
    { label: 'PS4', value: 'ps4' },
    { label: 'Xbox One', value: 'xbox-one' },
    { label: 'Switch', value: 'switch' },
    { label: 'Android', value: 'android' },
    { label: 'iOS', value: 'ios' },
  ]
};

export const GAME_CATEGORIES = [
  'mmorpg', 'shooter', 'strategy', 'moba', 'racing', 'sports', 'social', 'sandbox', 
  'open-world', 'survival', 'pvp', 'pve', 'pixel', 'voxel', 'zombie', 'turn-based', 
  'first-person', 'third-person', 'top-down', 'tank', 'space', 'sailing', 'side-scroller', 
  'superhero', 'permadeath', 'card', 'battle-royale', 'mmo', 'mmofps', 'mmotps', '3d', '2d', 
  'anime', 'fantasy', 'sci-fi', 'fighting', 'action-rpg', 'action', 'military', 'martial-arts', 
  'flight', 'low-spec', 'tower-defense', 'horror', 'mmorts'
];

export const GIVEAWAY_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'Game', value: 'game' },
  { label: 'Loot', value: 'loot' },
  { label: 'Beta', value: 'beta' },
];