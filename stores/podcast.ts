import { defineStore } from "pinia";
import type { Album } from "~/components/data/albums";
import { computed, reactive } from "vue";

export type RootState = {
  podcasts: Album[];
  episodes: [];
};

export const useMainStore = defineStore("mainStore", () => {
  const state = reactive<RootState>({
    podcasts: [],
    episodes: [],
  }) as RootState;

  const getPodcasts = computed((): Album[] => state.podcasts);

  const getEpisodes = computed((): [] => state.episodes);

  const getPodcastById = (id: string | string[]) => {
    return state.podcasts.items.find((item: {
      show: any; id: string 
}) => item.show.id === id);
  };

  const setEpisodes = (episodes: []): void => {
    state.episodes = episodes;
  };

  const setPodcasts = (podcasts: Album[]): void => {
    state.podcasts = podcasts;
  };

  return {
    getPodcasts,
    getEpisodes,
    setEpisodes,
    setPodcasts,
    getPodcastById,
  };
});
