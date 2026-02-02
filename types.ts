export interface FreeGame {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
}

export interface GameDetail extends FreeGame {
  status: string;
  description: string;
  minimum_system_requirements?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  screenshots: {
    id: number;
    image: string;
  }[];
}

export interface Giveaway {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  type: string;
  platforms: string;
  end_date: string;
  users: number;
  status: string;
  gamerpower_url: string;
}

export type WatchlistItem = {
  id: number;
  type: 'game' | 'giveaway';
  title: string;
  thumbnail: string;
  subtitle: string; // genre or worth
  platform: string;
  addedAt: number;
};

export type FilterState = {
  platform: string;
  sort: string;
  category?: string; // for games
  type?: string; // for giveaways
};