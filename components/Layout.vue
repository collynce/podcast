<script setup lang="ts">
import { playlists } from "./data/playlists";
</script>
<template>
  <div class="hidden md:block">
    <Menu />
    <div class="border-t">
      <div class="bg-background">
        <div class="grid lg:grid-cols-7">
          <Sidebar :playlists="playlists" class="hidden lg:block" />
          <div class="col-span-5 lg:col-span-6 lg:border-l">
            <div class="h-full w-full">
              <ScrollArea class="h-screen flex">
                <slot></slot>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
