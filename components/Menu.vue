<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';
</script>
<template>
  <Menubar class="rounded-none border-b border-none px-2 lg:px-4 flex justify-end">
    <MenubarMenu>
        <ThemeToggle></ThemeToggle>
    </MenubarMenu>
  </Menubar>
</template>