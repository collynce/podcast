import { ref, computed } from "vue";
import { useMainStore } from "@/stores/podcast";

export const usePodcasts = () => {
  const store = useMainStore();

  const podcasts = computed(() => store.getPodcasts);

  const getPodcasts = async () => {
    const data = await $fetch("/api/podcasts");
    store.setPodcasts(data);
  };

  const getEpisodes = async (id: string) => {
    const data = await $fetch("/api/episodes", {
      method: "POST",
      body: { id },
    });
    store.setEpisodes(data);
  };

  return {
    podcasts,
    getPodcasts,
    getEpisodes,
  };
};
