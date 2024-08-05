import { ref, computed } from "vue";
import { useMainStore } from "@/stores/podcast";

export const usePodcasts = () => {
  const store = useMainStore();

  const podcasts = computed(() => store.getPodcasts);
  const episodes = computed(() => store.getEpisodes);

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

  return {
    podcasts,
    getPodcasts,
    getEpisodes,
    getPodcastById,
    episodes,
  };
};
