<script setup lang="ts">
import { ref } from "vue";

const user = ref();
const podcasts = ref([]);
const episodes = ref([]);
const isLoading = ref(true);
const error = ref('');

const accessToken = useCookie("access_token");
const refreshToken = useCookie("refresh_token");

const initializeAuth = async () => {
  if (accessToken.value) {
    await fetchUserProfile();
  } else if (refreshToken.value) {
    await refreshAccessToken();
  } else {
    error.value = "No valid session. Please login.";
  }
};

const fetchUserProfile = async () => {
  try {
    const { data } = await useFetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    user.value = data.value;

  } catch (err) {
    await refreshAccessToken();
  }
};

const refreshAccessToken = async () => {
  if (refreshToken.value) {
    try {
      const { data } = await useFetch(`/api/refresh-token?refresh_token=${refreshToken.value}`);
      if (data.value && data.value) {
        // Token refreshed successfully, fetch user profile again
        await fetchUserProfile();
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (err) {
      error.value = "Session expired. Please login again.";
      user.value = null;
      accessToken.value = null;
      refreshToken.value = null;
    }
  }
};

const login = () => {
  window.location.href = "/api/login";
};

const getPodcasts = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch("/api/podcasts");
    podcasts.value = data.items;
  } catch (err) {
    await handleApiError(err, getPodcasts);
  } finally {
    isLoading.value = false;
  }
};

const getEpisodes = async (id: string) => {
  isLoading.value = true;
  try {
    const data = await $fetch("/api/episodes", {
      method: "POST",
      body: { id },
    });
    episodes.value = data.items;
  } catch (err) {
    await handleApiError(err, () => getEpisodes(id));
  } finally {
    isLoading.value = false;
  }
};

const transcribe = async (audioUrl: string) => {
  isLoading.value = true;
  try {
    await $fetch("/api/transcribe", {
      method: "POST",
      body: { audioUrl },
    });
    // Handle successful transcription (e.g., show a success message)
  } catch (err) {
    await handleApiError(err, () => transcribe(audioUrl));
  } finally {
    isLoading.value = false;
  }
};

const handleApiError = async (err: any, retryFunction: () => Promise<void>) => {
  if (err.response?.status === 401) {
    await refreshAccessToken();
    if (accessToken.value) {
      await retryFunction();
    }
  } else {
    error.value = "An error occurred. Please try again.";
  }
};

onMounted(() => {
  nextTick(async () => {
    await initializeAuth();
    isLoading.value = false
  })
})
</script>

<template>
  <div>
    <template v-if="isLoading">
      <p>Loading...</p>
    </template>
    <template v-else-if="error">
      <p>{{ error }}</p>
      <Button @click="login">Login with Spotify</Button>
    </template>
    <template v-else-if="user">
      <h2>Welcome, {{ user.display_name }}</h2>
      <Button @click="getPodcasts" :disabled="isLoading">Get Podcasts</Button>

      <div v-if="podcasts.length" class="mt-4">
        <h3>Podcasts</h3>
        <ul>
          <li v-for="podcast in podcasts" :key="podcast.show.id" class="mb-2">
            {{ podcast.show.name }}
            <Button @click="getEpisodes(podcast.show.id)" class="ml-2" :disabled="isLoading">
              Get Episodes
            </Button>
          </li>
        </ul>
      </div>

      <div v-if="episodes.length" class="mt-4">
        <h3>Episodes</h3>
        <ul>
          <li v-for="episode in episodes" :key="episode.id" class="mb-2">
            {{ episode.name }}
            <Button @click="transcribe(episode.audio_preview_url)" class="ml-2" :disabled="isLoading">
              Transcribe
            </Button>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <Button @click="login">Login with Spotify</Button>
    </template>
  </div>
</template>