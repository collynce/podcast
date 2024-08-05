<script setup lang="ts">
import { ConfigProvider } from "radix-vue";
import AudioPlayer from '@/components/AudioPlayer.vue';
const useIdFunction = () => useId();
</script>
<template>
  <ConfigProvider :use-id="useIdFunction">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AudioPlayer />
  </ConfigProvider>
</template>