import { defineStore } from "pinia";
import { computed, reactive } from "vue";

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

export const useMainStore = defineStore("mainStore", () => {
  const state = reactive<RootState>({
    podcasts: {
      href: "",
      items: [],
      limit: 20,
      next: null,
      offset: 0,
      previous: null,
      total: 0
    },
    episodes: {
      href: "",
      items: [],
      limit: 20,
      next: null,
      offset: 0,
      previous: null,
      total: 0
    },
    playingNow: null,
    isPlaying: false
  }) as RootState;

  const getPodcasts = computed((): PodcastsResponse => state.podcasts);
  const getEpisodes = computed((): EpisodesResponse => state.episodes);
  const getPlayingNow = computed((): Episode | null => state.playingNow);
  const isPlaying = computed((): boolean => state.isPlaying);

  const getPodcastById = (id: string | string[]) => {
    return state.podcasts.items.find(
      (item: Podcast) => item.show.id === id
    );
  };

  const setEpisodes = (episodes: EpisodesResponse): void => {
    state.episodes = episodes;
  };

  const setPodcasts = (podcasts: PodcastsResponse): void => {
    state.podcasts = podcasts;
  };

  const setIsPlaying = (value: boolean): void => {
    state.isPlaying = value;
  };

  const setPlayingNow = (episode: Episode | null): void => {
    state.playingNow = episode;
    state.isPlaying = !!episode;
  };

  return {
    getPodcasts,
    getEpisodes,
    setEpisodes,
    setPodcasts,
    getPodcastById,
    setPlayingNow,
    getPlayingNow,
    isPlaying,
    setIsPlaying
  };
});