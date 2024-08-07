<script setup lang="ts">
defineProps({
    width: {
        type: Number,
        default: 250
    },
    height: {
        type: Number,
        default: 330
    }
});
</script>
<template>
    <div class="rounded-md border bg-card text-card-foreground shadow animate-pulse"
        :style="{ width: `${width}px`, height: `${height}px` }">
        <div class="aspect-square h-full w-full">
            <div class="h-full w-full bg-muted"></div>
        </div>
        <div class="p-4 space-y-2">
            <div class="h-4 bg-muted rounded w-2/3"></div>
            <div class="h-3 bg-muted rounded w-1/2"></div>
        </div>
    </div>
</template>
