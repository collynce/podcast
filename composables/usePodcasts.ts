import { computed, type ComputedRef } from "vue";
import { useMainStore } from "@/stores/podcast";
import { useAuth } from "@/composables/useAuth";
import type { EpisodesResponse, PodcastsResponse } from "~/stores/types";

interface UsePodcastsReturn {
  podcasts: ComputedRef<PodcastsResponse>;
  episodes: ComputedRef<EpisodesResponse>;
  playingNow: ComputedRef<Episode | null>;
  isPlaying: ComputedRef<boolean>;
  getPodcasts: () => Promise<any>;
  getEpisodes: (
    id: string | string[],
    page: number,
    limit: number
  ) => Promise<any>;
  getPodcastById: (id: string | string[]) => any;
  setPlayingNow: (episode: Episode) => void;
  setIsPlaying: (value: boolean) => void;
}

export const usePodcasts = (): UsePodcastsReturn => {
  const store = useMainStore();
  const { handleApiError } = useAuth();

  const podcasts = computed(() => store.getPodcasts);
  const episodes = computed(() => store.getEpisodes);
  const playingNow = computed(() => store.getPlayingNow);
  const isPlaying = computed(() => store.isPlaying);

  const getPodcasts = async (): Promise<any> => {
    try {
      const data = await $fetch("/api/podcasts");
      store.setPodcasts(data);
      return data;
    } catch (err) {
      return handleApiError(err, getPodcasts);
    }
  };

  const getEpisodes = async (
    id: string | string[],
    page: number,
    limit: number
  ): Promise<any> => {
    try {
      const data = await $fetch("/api/episodes", {
        method: "POST",
        body: { id, offset: page ? (page - 1) * limit : 0, limit },
      });
      store.setEpisodes(data);
      return data;
    } catch (err) {
      return handleApiError(err, () => getEpisodes(id, page, limit));
    }
  };

  const getPodcastById = (id: string | string[]): any => {
    return store.getPodcastById(id);
  };

  const setPlayingNow = (episode: Episode): void => {
    store.setPlayingNow(episode);
  };

  const setIsPlaying = (value: boolean): void => {
    store.setIsPlaying(value);
  };

  return {
    podcasts,
    episodes,
    playingNow,
    isPlaying,
    getPodcasts,
    getEpisodes,
    getPodcastById,
    setPlayingNow,
    setIsPlaying,
  };
};
