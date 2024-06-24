<template>
  <div>
    <Button @click="login" v-if="!user">Login with Spotify</Button>
    <div v-if="user">
      <h2>Welcome, {{ user.display_name }}</h2>
    </div>

    <div
      v-if="podcasts"
      v-for="(podcast, index) in podcasts.items"
      :key="index + podcast.show.id"
    >
      {{ podcast.show.name }}
      <span class="text-blue-500" @click="getEpisodes(podcast.show.id)"
        >episode</span
      >
    </div>
    <Button @click="getPodcasts">Get Podcasts</Button>

    <br />
    Episode
    <div
      v-if="episodes"
      v-for="(episode, index) in episodes.items"
      :key="index"
    >
      <span @click="transcribe(episode.audio_preview_url)">Summary</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const user = ref(null);
const accessToken = useCookie("access_token");
const podcasts = ref([]);
const episodes = ref([]);

const login = () => {
  window.location.href = "/api/login";
};

if (accessToken.value) {
  const { data } = await useFetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  });
  user.value = data.value;
}

const getPodcasts = async () => {
  const data = await $fetch("/api/podcasts");

  podcasts.value = data;
};

const getEpisodes = async (id: string) => {
  const data = await $fetch("/api/episodes", {
    method: "POST",
    body: { id },
  });
  episodes.value = data;
};

const transcribe = async (audioUrl: string) => {
  const data = await $fetch("/api/transcribe", {
    method: "POST",
    body: { audioUrl },
  });
};
</script>
