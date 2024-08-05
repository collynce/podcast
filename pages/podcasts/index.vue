<script setup lang="ts">
import AlbumArtwork from "../../components/AlbumArtwork.vue";
import PodcastEmptyPlaceholder from "../../components/PodcastEmptyPlaceholder.vue";
import { usePodcasts } from "~/composables/usePodcasts";

import { madeForYouAlbums } from "../../components/data/albums";
import { PlusCircledIcon } from "@radix-icons/vue";

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
      <div class="md:hidden">
        <!-- <VPImage
      alt="Music"
      width="1280"
      height="1214"
      class="block"
      :image="{
        dark: '/examples/music-dark.png',
        light: '/examples/music-light.png',
      }"
    /> -->
      </div>
      <Tabs default-value="music" class="h-full space-y-6">
        <div class="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="music" class="relative"> Music </TabsTrigger>
            <TabsTrigger value="podcasts"> Podcasts </TabsTrigger>
            <TabsTrigger value="live" disabled> Live </TabsTrigger>
          </TabsList>
          <div class="ml-auto mr-4">
            <Button>
              <PlusCircledIcon class="mr-2 h-4 w-4" />
              Add music
            </Button>
          </div>
        </div>
        <TabsContent value="music" class="border-none p-0 outline-none">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">Listen Now</h2>
              <p class="text-sm text-muted-foreground">
                Top picks for you. Updated daily.
              </p>
            </div>
          </div>
          <Separator class="my-4" />
          <div class="relative">
            <ScrollArea>
              <div class="flex space-x-4 pb-4">
                <AlbumArtwork
                  v-for="(album, idx) in podcasts?.items"
                  :key="idx"
                  :album="filterPodcasts(album)"
                  class="w-[250px]"
                  aspect-ratio="portrait"
                  :width="250"
                  :height="330"
                  @get-episodes="getEpisodes"
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <Separator class="my-4" />
          <div class="relative">
            <ScrollArea>
              <div class="flex space-x-4 pb-4">
                <AlbumArtwork
                  v-for="album in madeForYouAlbums"
                  :key="album.name"
                  :album="album"
                  class="w-[150px]"
                  aspect-ratio="square"
                  :width="150"
                  :height="150"
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent
          value="podcasts"
          class="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">
                New Episodes
              </h2>
              <p class="text-sm text-muted-foreground">
                Your favorite podcasts. Updated daily.
              </p>
            </div>
          </div>
          <Separator class="my-4" />
          <PodcastEmptyPlaceholder />
        </TabsContent>
      </Tabs>
    </div>
  </Layout>
</template>
