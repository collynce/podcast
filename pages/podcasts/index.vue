<script setup lang="ts">
import AlbumArtwork from "../../components/AlbumArtwork.vue";
import PodcastEmptyPlaceholder from "../../components/PodcastEmptyPlaceholder.vue";
import { usePodcasts } from "~/composables/usePodcasts";

import { madeForYouAlbums } from "../../components/data/albums";

const podcasts = usePodcasts().podcasts;

const getEpisodes = async (event: any) => {
  navigateTo("/podcasts/" + event.id);
};

const filterPodcasts = (item: {
  show: {
    id: any;
    name: any;
    publisher: any;
    images: { url: any }[];
  };
}) => {
  return {
    name: item.show.name,
    artist: item.show.publisher,
    cover: item.show.images[0].url,
    id: item.show.id,
  };
};

onMounted(() => {
  usePodcasts().getPodcasts();
});
</script>

<template>
  <Layout>
    <div class="px-4 py-6 lg:px-8">
      <div class="h-full space-y-6">
        <div class="border-none p-0 outline-none">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">Listen Now</h2>
              <p class="text-sm text-muted-foreground">
                Top picks for you. Updated daily.
              </p>
            </div>
          </div>
          <Separator class="my-4" />
          <PodcastEmptyPlaceholder v-if="!podcasts.hasOwnProperty('items')" />
          <div class="relative" v-else>
            <ScrollArea>
              <div class="flex space-x-4 pb-4">
                <AlbumArtwork v-for="(album, idx) in podcasts?.items" :key="idx" :album="filterPodcasts(album)"
                  class="w-full" aspect-ratio="portrait" :width="250" :height="330" @get-episodes="getEpisodes" />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <Separator class="my-4" />
          <div class="relative">
            <ScrollArea>
              <div class="flex space-x-4 pb-4">
                <AlbumArtwork v-for="album in madeForYouAlbums" :key="album.name" :album="album" class="w-[150px]"
                  aspect-ratio="square" :width="150" :height="150" />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
