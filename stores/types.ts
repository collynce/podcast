export type Podcast = {
    added_at: string;
    show: {
      id: string;
      name: string;
      publisher: string;
      images: { url: string }[];
    };
  };
  
  export type Episode = {
    transcriptSid: any;
    summary: string;
    id: string;
    name: string;
    description: string;
    html_description: string;
    audio_preview_url: string;
    duration_ms: number;
    release_date: string;
    images: { url: string; height: number; width: number }[];
  };
  
  export type PodcastsResponse = {
    href: string;
    items: Podcast[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  
  export type EpisodesResponse = {
    href: string;
    items: Episode[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  
  export type RootState = {
    podcasts: PodcastsResponse;
    episodes: EpisodesResponse;
    playingNow: Episode | null;
    isPlaying: boolean
  };

  export type UserState = {
    user: SpotifyUser | null
}

export interface SpotifyUser {
    display_name: string;
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: any[];
    type: string;
    uri: string;
    followers: {
        href: string | null;
        total: number;
    };
    country: string;
    product: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    email: string;
}