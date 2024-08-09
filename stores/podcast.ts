import { defineStore } from "pinia";
import { computed, reactive } from "vue";

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