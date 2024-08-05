<script setup lang="ts">
import { PlayIcon } from '@radix-icons/vue';
const podcastHelper = usePodcasts();
const episodes = podcastHelper.episodes;
const podcast = ref({});
const route = useRoute();

const getItems = async () => {
  if (!podcastHelper.podcasts.value.length) {
    await podcastHelper.getPodcasts();
  }

  await podcastHelper.getEpisodes(route.params.id);

  podcast.value = await podcastHelper.getPodcastById(route.params.id);
};

const filterEpisodes = (item: {
  name: any;
  images: { url: any }[];
  id: any;
}) => {
  return {
    name: item.name,
    artist: "",
    cover: item.images[1].url,
    id: item.id,
  };
};

onMounted(() => {
  getItems();
});
</script>
<template>
  <Layout>
    <Separator></Separator>
    <div class="bg-muted/60 h-80 relative">
      <div class="absolute w-40 h-40 top-40 left-10 transform -translate-y-1/2 overflow-hidden shadow-lg">
        <img
          v-if="podcast.show?.images?.[0]?.url"
          :src="podcast.show?.images[0].url"
          alt="Podcast Cover"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background"></div>
      <div class="absolute bottom-8 left-64 text-white">
        <h1 class="text-4xl font-bold">{{ podcast.show?.name }}</h1>
        <p class="text-lg mt-2">{{ podcast.show?.publisher }}</p>
      </div>
    </div>
    <div class="relative px-4 py-6 lg:px-8">
      <div class="space-y-4">
        <div v-for="(episode, idx) in episodes.items" :key="idx" class="flex items-center space-x-4 hover:bg-muted/50 p-4 rounded-lg transition-colors">
          <img :src="episode.images[0].url" alt="Episode Cover" class="w-20 h-20 object-cover rounded-md" />
          <div class="flex-grow">
            <h3 class="text-lg font-semibold">{{ episode.name }}</h3>
            <p class="text-sm text-muted-foreground line-clamp-2">{{ episode.description }}</p>
            <!-- <p class="text-xs text-muted-foreground mt-1">{{ new Date(episode.release_date).toLocaleDateString() }} · {{ formatDuration(episode.duration_ms) }}</p> -->
          </div>
          <Button variant="ghost" size="icon">
            <PlayIcon class="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  </Layout>
</template>
