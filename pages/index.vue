<script setup lang="ts">
const { podcasts: latestPodcasts, getPodcasts } = usePodcasts();
const { user: currentUser, setUser, accessToken } = useAuth();
const podcasts = ref(latestPodcasts.value);
const user = ref(currentUser.value);
const isLoading = ref(true);
const error = ref("");
const skeletonCount = 5;

const fetchUserProfile = async () => {
  if (!accessToken.value) return;

  await setUser();
  user.value = currentUser.value;
};

const getItems = async () => {
  error.value = "";
  if (!podcasts.value.items.length) {
    await getPodcasts();
    podcasts.value = latestPodcasts.value;
  }

  if (!user.value) {
    await fetchUserProfile();
  }

  isLoading.value = false;
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
                <h2 class="text-2xl font-semibold tracking-tight">Podcasts</h2>
                <p class="text-sm text-muted-foreground">
                  {{
                    user
                      ? "Top picks for you."
                      : "Connect your Spotify account to start exploring podcasts."
                  }}
                </p>
              </template>
            </div>
          </div>
          <Separator class="my-4" />
          <template v-if="isLoading">
            <div class="relative">
              <div class="grid grid-cols-5 gap-6">
                <PodcastSkeleton
                  v-for="i in skeletonCount"
                  :key="i"
                  class="w-full mx-3"
                  :width="250"
                  :height="250"
                />
              </div>
            </div>
          </template>
          <template v-else-if="error">
            <div class="flex justify-center items-center h-64">
              <p>{{ error }}</p>
            </div>
          </template>
          <PodcastEmptyPlaceholder v-else-if="!user" />
          <div class="relative" v-else>
            <ScrollArea>
              <div class="grid grid-cols-5 gap-4">
                <AlbumArtwork
                  v-for="(album, idx) in podcasts.items"
                  :key="idx"
                  :album="filterPodcasts(album)"
                  class="w-full mb-4"
                  aspect-ratio="square"
                  :width="180"
                  :height="180"
                  @get-episodes="getEpisodes"
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
