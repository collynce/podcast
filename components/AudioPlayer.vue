<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { usePodcasts } from "@/composables/usePodcasts";
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "radix-vue";
const sliderValue = ref([50]);

import {
  PlayIcon,
  PauseIcon,
  TrackPreviousIcon,
  TrackNextIcon,
  CrossCircledIcon,
  ShuffleIcon,
  LoopIcon,
  FrameIcon,
  ListBulletIcon,
  MixerHorizontalIcon,
  SpeakerLoudIcon,
  SlashIcon,
} from "@radix-icons/vue";

const { playingNow, isPlaying, setIsPlaying } = usePodcasts();

const audioRef = ref<HTMLAudioElement | null>(null);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);

const progress = computed(
  () => (currentTime.value / duration.value) * 100 || 0
);

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

watch(playingNow, (newEpisode) => {
  if (newEpisode && audioRef.value) {
    audioRef.value.src = newEpisode.audio_preview_url;
    audioRef.value.load();
    if (isPlaying.value) audioRef.value.play();
  }
});

watch(isPlaying, (newIsPlaying) => {
  if (audioRef.value) {
    newIsPlaying ? audioRef.value.play() : audioRef.value.pause();
  }
});

const togglePlay = () => setIsPlaying(!isPlaying.value);

const handleTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
    duration.value = audioRef.value.duration;
  }
};

const handleSeek = (e: MouseEvent) => {
  const progressBar = e.currentTarget as HTMLDivElement;
  const clickPosition = e.offsetX / progressBar.offsetWidth;
  if (audioRef.value) {
    audioRef.value.currentTime = clickPosition * audioRef.value.duration;
    currentTime.value = audioRef.value.currentTime;
  }
};

const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const newVolume = parseFloat(target.value);
  volume.value = newVolume;
  if (audioRef.value) audioRef.value.volume = newVolume;
};

const handlePrevious = () => {
  // Implement previous track logic
};

const handleNext = () => {
  // Implement next track logic
};

const handleShuffle = () => {
  // Implement shuffle logic
};

const handleRepeat = () => {
  // Implement repeat logic
};

const handlePictureInPicture = () => {
  // Implement picture-in-picture logic
};

const handleLyrics = () => {
  // Implement lyrics display logic
};

const handleQueue = () => {
  // Implement queue display logic
};

const handleClose = () => {
  // Implement close player logic
};
</script>

<template>
  <div
    v-if="playingNow"
    class="fixed bottom-0 left-0 right-0 bg-black text-white"
  >
    <div
      class="flex-grow h-1 bg-gray-600 rounded-full cursor-pointer w-full mb-3"
      @click="handleSeek"
    >
      <div
        class="h-full bg-white rounded-full"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="flex items-center space-x-3">
        <img
          :src="playingNow.images[0]?.url"
          alt="Album Cover"
          class="w-12 h-12 object-cover"
        />
        <div>
          <p class="text-sm font-semibold">{{ playingNow.name }}</p>
        </div>
      </div>
      <div class="flex flex-col items-center flex-grow mx-4">
        <div class="flex items-center space-x-4 mb-2">
          <button @click="handleShuffle" class="text-gray-400 hover:text-white">
            <ShuffleIcon class="w-5 h-5" />
          </button>
          <button
            @click="handlePrevious"
            class="text-gray-400 hover:text-white"
          >
            <TrackPreviousIcon class="w-5 h-5" />
          </button>
          <button @click="togglePlay" class="bg-white rounded-full p-1">
            <PauseIcon v-if="isPlaying" class="w-6 h-6 text-black" />
            <PlayIcon v-else class="w-6 h-6 text-black" />
          </button>
          <button @click="handleNext" class="text-gray-400 hover:text-white">
            <TrackNextIcon class="w-5 h-5" />
          </button>
          <button @click="handleRepeat" class="text-gray-400 hover:text-white">
            <LoopIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="flex items-center mr-4">
        <span class="text-xs">
          {{ formatTime(currentTime) }}
        </span>
        <SlashIcon class="w-4 h-3" />
        <span class="text-xs">
          {{ formatTime(duration) }}
        </span>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="handleLyrics" class="text-gray-400 hover:text-white">
          <MixerHorizontalIcon class="w-5 h-5" />
        </button>
        <button @click="handleQueue" class="text-gray-400 hover:text-white">
          <ListBulletIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-1">
          <SpeakerLoudIcon class="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @input="handleVolumeChange"
            class="w-20"
          />

          <SliderRoot
            v-model="sliderValue"
            class="relative flex items-center select-none touch-none w-[200px] h-5"
            :max="100"
            :step="1"
          >
            <SliderTrack class="bg-blackA10 relative grow rounded-full h-[3px]">
              <SliderRange class="absolute bg-white rounded-full h-full" />
            </SliderTrack>
            <SliderThumb
              class="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8"
              aria-label="Volume"
            />
          </SliderRoot>
        </div>
        <button @click="handleClose" class="text-gray-400 hover:text-white">
          <CrossCircledIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <audio
      ref="audioRef"
      :src="playingNow.audio_preview_url"
      @play="setIsPlaying(true)"
      @pause="setIsPlaying(false)"
      @timeupdate="handleTimeUpdate"
      class=""
    ></audio>
  </div>
</template>
