<script setup lang="ts">
import { ref } from "vue";
const route = useRoute();
const episodes = ref([]);

const getEpisodes = async () => {
  const data = await $fetch("/api/episodes", {
    method: "POST",
    body: { id: route.params.id },
  });
  episodes.value = data;
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
  getEpisodes();
});
</script>
<template>
  <Layout>
    <Separator></Separator>
    <div class="bg-muted/60 h-80">
      
    </div>
    <div class="relative px-4 py-6 lg:px-8">
      <!-- <ScrollArea> -->
      <div class="grid grid-cols-8 gap-5 mt-6">
        <AlbumArtwork
          v-for="(album, idx) in episodes.items"
          :key="idx"
          :album="filterEpisodes(album)"
          class="w-[90%] mx-auto"
          aspect-ratio="square"
          :width="150"
          :height="150"
        />
      </div>
      <!-- <ScrollBar orientation="horizontal" /> -->
      <!-- </ScrollArea> -->
    </div>
  </Layout>
</template>
