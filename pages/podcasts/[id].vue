<script setup lang="ts">
import { PlayIcon } from "@radix-icons/vue";
import { Icon } from "@iconify/vue";
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from "radix-vue";

const {
  getPodcasts,
  getEpisodes,
  setPlayingNow,
  episodes,
  podcasts,
  getPodcastById,
} = usePodcasts();
const latestEpisodes = ref(episodes.value.items);
const podcast = ref<Podcast | null>(null);
const route = useRoute();
const loading = ref(true);
const summarizing = ref<string | null>(null);
const currentPage = ref(1);
const offset = ref(episodes.value.offset);
const itemsPerPage = ref(episodes.value.limit);
const totalItems = ref(episodes.value.total);

const getItems = async () => {
  loading.value = true;
  if (!podcasts.value.items.length) {
    await getPodcasts();
  }

  await fetchEpisodes(route.params.id as string, 0, 20);

  podcast.value = getPodcastById(route.params.id as string) || null;
  loading.value = false;
};

const fetchEpisodes = async (id: string, page: number, limit: number) => {
  await getEpisodes(id, page, limit);

  latestEpisodes.value = episodes.value.items;
  offset.value = episodes.value.offset;
  itemsPerPage.value = episodes.value.limit;
  totalItems.value = episodes.value.total;
};

const playEpisode = (episode: Episode) => {
  setPlayingNow(episode);
};

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const summarizeEpisode = async (episode: Episode) => {
  if (summarizing.value === episode.id) return;

  summarizing.value = episode.id;
  try {
    const transcript = await $fetch("/api/transcribe", {
      method: "POST",
      body: { audioUrl: episode.audio_preview_url },
    }).catch((error) => {
      throw new Error(error);
    });

    // Store the transcript SID for future use if needed
    // episode.transcriptSid = transcript.sid

    // For now, we'll use the transcript status as a placeholder for the summary
    // episode.summary = `Transcript status: ${transcript.status}`

    // TODO: Implement actual summarization logic once the transcript is complete
    // This might involve polling the Twilio API for the completed transcript
    // and then sending it to a summarization service
  } catch (error) {
    console.error("Failed to transcribe episode:", error);
    episode.summary = "Failed to generate summary";
  } finally {
    summarizing.value = null;
  }
};

const nextPrevPage = async (value: number) => {
  if (value !== currentPage.value) {
    loading.value = true;
    currentPage.value = value;
    await fetchEpisodes(route.params.id as string, value, 20);
    loading.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>
<template>
  <Layout>
    <Separator></Separator>
    <div class="bg-muted/60 h-80 relative">
      <div
        class="absolute w-40 h-40 top-40 left-10 transform -translate-y-1/2 overflow-hidden shadow-lg"
      >
        <Skeleton v-if="loading" class="w-full h-full" />
        <NuxtImg
          v-else-if="(podcast as Podcast)?.show?.images?.[0]?.url"
          :src="(podcast as Podcast).show?.images[0].url"
          alt="Podcast Cover"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background"
      ></div>
      <div class="absolute bottom-24 left-56 dark:text-white">
        <Skeleton v-if="loading" class="h-12 w-64 mb-2" />
        <Skeleton v-if="loading" class="h-6 w-48" />
        <template v-else>
          <h1 class="text-6xl font-bold">
            {{ (podcast as Podcast).show?.name }}
          </h1>
          <p class="text-lg mt-2">{{ (podcast as Podcast).show?.publisher }}</p>
        </template>
      </div>
    </div>
    <div class="relative px-4 py-6 lg:px-8">
      <div class="space-y-4">
        <template v-if="loading">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center space-x-4 p-4 rounded-lg"
          >
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
          <div
            v-for="episode in latestEpisodes"
            :key="episode.id"
            class="flex flex-col space-y-2 hover:bg-muted/50 p-4 rounded-lg transition-colors"
          >
            <div class="flex items-center space-x-4">
              <NuxtImg
                :src="episode.images[0].url"
                alt="Episode Cover"
                class="w-20 h-20 object-cover rounded-md"
              />
              <div class="flex-grow">
                <h3 class="text-lg font-semibold">{{ episode.name }}</h3>
                <p
                  class="text-sm text-muted-foreground line-clamp-2"
                  v-html="episode.html_description"
                ></p>
                <p class="text-xs text-muted-foreground mt-1.5 font-bold">
                  {{ new Date(episode.release_date).toLocaleDateString() }} ·
                  {{ formatDuration(episode.duration_ms) }}
                </p>
              </div>
              <div class="flex flex-col items-end">
                <Button
                  variant="ghost"
                  size="icon"
                  @click="playEpisode(episode)"
                >
                  <PlayIcon class="h-6 w-6" />
                </Button>
                <Button
                  @click="summarizeEpisode(episode)"
                  :disabled="summarizing === episode.id"
                >
                  {{
                    summarizing === episode.id
                      ? "Transcribing..."
                      : "Transcribe"
                  }}
                </Button>
              </div>
            </div>
            <!-- <p v-if="episode.summary" class="mt-2 text-sm text-muted-foreground">{{ episode.summary }}</p> -->
          </div>
        </template>
      </div>
      <div class="mt-4">
        <PaginationRoot
          :total="totalItems"
          :sibling-count="1"
          show-edges
          :itemsPerPage="itemsPerPage"
          @update:page="nextPrevPage"
          :default-page="currentPage"
          :disabled="currentPage == currentPage - 1"
        >
          <PaginationList
            v-slot="{ items }"
            class="flex items-center gap-1 text-white"
          >
            <PaginationFirst
              class="w-9 h-9 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded"
            >
              <Icon icon="radix-icons:double-arrow-left" />
            </PaginationFirst>
            <PaginationPrev
              class="w-9 h-9 flex items-center justify-center mr-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded"
            >
              <Icon icon="radix-icons:chevron-left" />
            </PaginationPrev>
            <template v-for="(page, index) in items">
              <PaginationListItem
                v-if="page.type === 'page'"
                :key="index"
                class="w-9 h-9 border rounded data-[selected]:bg-white data-[selected]:text-black hover:bg-white/10 transition focus-within:outline-1 focus-within:outline-offset-1"
                :value="page.value"
              >
                {{ page.value }}
              </PaginationListItem>
              <PaginationEllipsis
                v-else
                :key="page.type"
                :index="index"
                class="w-9 h-9 flex items-center justify-center"
              >
                &#8230;
              </PaginationEllipsis>
            </template>
            <PaginationNext
              class="w-9 h-9 flex items-center justify-center ml-4 disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded"
            >
              <Icon icon="radix-icons:chevron-right" />
            </PaginationNext>
            <PaginationLast
              class="w-9 h-9 flex items-center justify-center disabled:opacity-50 focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded"
            >
              <Icon icon="radix-icons:double-arrow-right" />
            </PaginationLast>
          </PaginationList>
        </PaginationRoot>
      </div>
    </div>
  </Layout>
</template>
