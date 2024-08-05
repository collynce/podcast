import { computed } from "vue";
import { useMainStore, type Episode } from "@/stores/podcast";

export const usePodcasts = () => {
  const store = useMainStore();

  const podcasts = computed(() => store.getPodcasts);
  const episodes = computed(() => store.getEpisodes);
  const playingNow = computed(() => store.getPlayingNow);
  const isPlaying = computed(() => store.isPlaying);

  const getPodcasts = async () => {
    const data = await $fetch("/api/podcasts");
    store.setPodcasts(data);
  };

  const getEpisodes = async (id: string | string[]) => {
    const data = await $fetch("/api/episodes", {
      method: "POST",
      body: { id },
    });
    store.setEpisodes(data);
  };

  const getPodcastById = (id: string | string[]) => {
    return store.getPodcastById(id);
  };

  const setPlayingNow = (episode: Episode) => {
    store.setPlayingNow(episode);
  }

  const setIsPlaying = (value: boolean) => {
    store.setIsPlaying(value)
  }

  return {
    podcasts,
    getPodcasts,
    getEpisodes,
    getPodcastById,
    episodes,
    setPlayingNow,
    playingNow,
    isPlaying,
    setIsPlaying
  };
};
