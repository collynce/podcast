<script setup lang="ts">
import { PlayIcon } from '@radix-icons/vue';
import type { Podcast, Episode } from '~/stores/podcast';

const podcastHelper = usePodcasts();
const episodes = ref<Episode[]>([]);
const podcast = ref<Podcast | null>(null);
const route = useRoute();
const loading = ref(true);

const getItems = async () => {
  loading.value = true;
  if (!podcastHelper.podcasts.value.items.length) {
    await podcastHelper.getPodcasts();
  }
  await podcastHelper.getEpisodes(route.params.id as string);
  episodes.value = podcastHelper.episodes.value.items || [];

  podcast.value = podcastHelper.getPodcastById(route.params.id as string) || null;
  loading.value = false;
};

const playEpisode = (episode: Episode) => {
  usePodcasts().setPlayingNow(episode);
};

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        <Skeleton v-if="loading" class="w-full h-full" />
        <img v-else-if="(podcast as Podcast)?.show?.images?.[0]?.url" :src="(podcast as Podcast).show?.images[0].url"
          alt="Podcast Cover" class="w-full h-full object-cover" />
      </div>
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background"></div>
      <div class="absolute bottom-24 left-56 text-white">
        <Skeleton v-if="loading" class="h-12 w-64 mb-2" />
        <Skeleton v-if="loading" class="h-6 w-48" />
        <template v-else>
          <h1 class="text-6xl font-bold">{{ (podcast as Podcast).show?.name }}</h1>
          <p class="text-lg mt-2">{{ (podcast as Podcast).show?.publisher }}</p>
        </template>
      </div>
    </div>
    <div class="relative px-4 py-6 lg:px-8">
      <div class="space-y-4">
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="flex items-center space-x-4 p-4 rounded-lg">
            <Skeleton class="w-20 h-20 rounded-md" />
            <div class="flex-grow">
              <Skeleton class="h-6 w-3/4 mb-2" />
              <Skeleton class="h-4 w-full mb-1" />
              <Skeleton class="h-4 w-2/3" />
            </div>
            <Skeleton class="w-10 h-10 rounded-full" />
          </div>
        </template>
        <template v-else>
          <div v-for="episode in episodes" :key="episode.id"
            class="flex items-center space-x-4 hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <img :src="episode.images[0].url" alt="Episode Cover" class="w-20 h-20 object-cover rounded-md" />
            <div class="flex-grow">
              <h3 class="text-lg font-semibold">{{ episode.name }}</h3>
              <p class="text-sm text-muted-foreground line-clamp-2" v-html="episode.html_description"></p>
              <p class="text-xs text-muted-foreground mt-1.5 font-bold">
                {{ new Date(episode.release_date).toLocaleDateString() }} · {{ formatDuration(episode.duration_ms) }}
              </p>
            </div>
            <Button variant="ghost" size="icon" @click="playEpisode(episode)">
              <PlayIcon class="h-6 w-6" />
            </Button>
          </div>
        </template>
      </div>
    </div>
  </Layout>
</template>