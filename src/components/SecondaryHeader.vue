<script setup lang="ts">
import { useIsArchiveStore } from "../stores/isArchive";
import { storeToRefs } from "pinia";
const isArchiveStore = useIsArchiveStore();
const { isArchive } = storeToRefs(isArchiveStore);
const { toggleIsArchive } = isArchiveStore;
</script>

<template>
  <header class="fixed top-10 w-full">
    <div
      class="flex justify-between px-4 items-center bg-gray-400 text-black py-2"
    >
      <button @click="toggleIsArchive">
        {{ isArchive ? "Unarchive Notes" : "Archived Notes" }}
      </button>
    </div>
  </header>
</template>
