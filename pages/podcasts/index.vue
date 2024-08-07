<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AlbumArtwork from "../../components/AlbumArtwork.vue";
import PodcastEmptyPlaceholder from "../../components/PodcastEmptyPlaceholder.vue";
import { usePodcasts } from "~/composables/usePodcasts";
import { madeForYouAlbums } from "../../components/data/albums";

const { podcasts: latestPodcasts, getPodcasts } = usePodcasts();
const { user: currentUser, setUser, accessToken, refreshToken } = useUser();
const podcasts = ref(latestPodcasts.value);
const user = ref(currentUser.value);
const isLoading = ref(true);
const error = ref('');
const skeletonCount = 4;

const fetchUserProfile = async () => {
  if (!accessToken.value) return;

  try {
    await setUser()
    user.value = currentUser.value;
  } catch (err) {
    await handleApiError(err, fetchUserProfile);
  }
};

const refreshAccessToken = async () => {
  if (!refreshToken.value) return false;

  try {
    const { data } = await useFetch(`/api/refresh-token?refresh_token=${refreshToken.value}`);
    if (data.value && data.value) {
      return true;
    }
    throw new Error("Failed to refresh token");
  } catch (err) {
    console.error("Error refreshing token:", err);
    error.value = "Session expired. Please login again.";
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    return false;
  }
};

const handleApiError = async (err: any, retryFunction: () => Promise<void>) => {
  if (err.response?.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      await retryFunction();
    }
  } else {
    console.error("API Error:", err);
    error.value = "An error occurred. Please try again.";
  }
};

const getItems = async () => {
  error.value = '';

  try {
    if (!podcasts.value.items.length) {
      await getPodcasts();
      podcasts.value = latestPodcasts.value;
    }

    if (!user.value) {
      await fetchUserProfile();
    }

  } catch (err) {
    await handleApiError(err, getItems);
  } finally {
    isLoading.value = false;
  }
};

const getEpisodes = (event: any) => {
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
  getItems();
});
</script>
<template>
  <Layout>
    <div class="px-4 py-6 lg:px-8">
      <div class="h-full space-y-6">
        <div class="border-none p-0 outline-none">
          <div class="">
            <div class="space-y-1">
              <template v-if="isLoading">
                <HeadingSkeleton />
              </template>
              <template v-else>
                <h2 class="text-2xl font-semibold tracking-tight">Listen Now</h2>
                <p class="text-sm text-muted-foreground">
                  {{ user
                    ? 'Top picks for you. Updated daily.'
                    : 'Connect your Spotify account to start exploring podcasts.'
                  }}
                </p>
              </template>
            </div>
          </div>
          <Separator class="my-4" />
          <template v-if="isLoading">
            <div class="relative">
              <ScrollArea>
                <div class="flex space-x-4 pb-4">
                  <PodcastSkeleton v-for="i in skeletonCount" :key="i" class="w-full" :width="250" :height="330" />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </template>
          <template v-else-if="error">
            <div class="flex justify-center items-center h-64">
              <p>{{ error }}</p>
            </div>
          </template>
          <PodcastEmptyPlaceholder v-else-if="!podcasts?.items?.length || !user" />
          <div class="relative" v-else>
            <ScrollArea>
              <div class="flex space-x-4 pb-4">
                <AlbumArtwork v-for="(album, idx) in podcasts.items" :key="idx" :album="filterPodcasts(album)"
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