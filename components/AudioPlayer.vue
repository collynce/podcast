<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { usePodcasts } from "@/composables/usePodcasts";
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "radix-vue";
import {
  PlayIcon,
  PauseIcon,
  TrackPreviousIcon,
  TrackNextIcon,
  ShuffleIcon,
  LoopIcon,
  ListBulletIcon,
  MixerHorizontalIcon,
  SpeakerLoudIcon,
  SlashIcon,
  SpeakerOffIcon,
} from "@radix-icons/vue";

const { playingNow, isPlaying, setIsPlaying } = usePodcasts();

const audioRef = ref<HTMLAudioElement | null>(null);
const isAudioReady = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const sliderValue = ref([1]);

const progress = computed(
  () => (currentTime.value / duration.value) * 100 || 0
);

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const playAudio = async () => {
  if (audioRef.value && isAudioReady.value) {
    try {
      await audioRef.value.play();
    } catch (error) {
      console.error("Playback failed", error);
      setIsPlaying(false);
    }
  }
};

const loadAudio = () => {
  if (audioRef.value && playingNow.value) {
    audioRef.value.src = playingNow.value.audio_preview_url;
    audioRef.value.load();
    isAudioReady.value = true;
  }
};

watch(playingNow, async (newEpisode) => {
  if (newEpisode) {
    isAudioReady.value = false;
    await nextTick();
    loadAudio();
    if (isPlaying.value) {
      await playAudio();
    }
  }
});

watch(isPlaying, async (newIsPlaying) => {
  if (newIsPlaying) {
    await playAudio();
  } else if (audioRef.value) {
    audioRef.value.pause();
  }
});

onMounted(() => {
  if (playingNow.value) {
    loadAudio();
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

const handleSliderVolumeChange = (payload: number[] | undefined) => {
  if (payload && payload.length > 0) {
    const newVolume = payload[0] / 100;
    volume.value = newVolume;
    if (audioRef.value) audioRef.value.volume = newVolume;
  }
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
  <div v-if="playingNow" class="fixed bottom-0 left-0 right-0 bg-black text-white">
    <div class="flex-grow h-1 bg-gray-600 rounded-full cursor-pointer w-full mb-3" @click="handleSeek">
      <div class="h-full bg-white rounded-full" :style="{ width: `${progress}%` }"></div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="flex items-center space-x-3">
        <img :src="playingNow.images[0]?.url" alt="Album Cover" class="w-12 h-12 object-cover" />
        <div>
          <p class="text-sm font-semibold">{{ playingNow.name }}</p>
        </div>
      </div>
      <div class="flex flex-col items-center flex-grow mx-4">
        <div class="flex items-center space-x-4 mb-2">
          <button @click="handleShuffle" class="text-gray-400 hover:text-white">
            <ShuffleIcon class="w-5 h-5" />
          </button>
          <button @click="handlePrevious" class="text-gray-400 hover:text-white">
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
          <SpeakerLoudIcon class="w-4 h-4 text-gray-400" v-if="sliderValue.length && sliderValue[0] > 0" />
          <SpeakerOffIcon class="w-4 h-4 text-gray-400" v-else />
          <SliderRoot v-model="sliderValue" class="relative flex items-center select-none touch-none w-[100px] h-5"
            :max="1" :step="0.01" @update:modelValue="handleSliderVolumeChange">
            <SliderTrack class="bg-blackA10 relative grow rounded-full h-[3px]">
              <SliderRange class="absolute bg-white rounded-full h-full" />
            </SliderTrack>
            <SliderThumb class="block w-3 h-3 bg-white rounded-[10px] hover:bg-violet3 focus:outline-none"
              aria-label="Volume" />
          </SliderRoot>
        </div>
      </div>
    </div>
    <audio ref="audioRef" :src="playingNow.audio_preview_url" @play="setIsPlaying(true)" @pause="setIsPlaying(false)"
      @timeupdate="handleTimeUpdate" class=""></audio>
  </div>
</template>