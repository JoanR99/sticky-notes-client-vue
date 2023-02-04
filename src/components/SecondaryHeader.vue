<script setup lang="ts">
import { useIsArchiveStore } from "../stores/isArchive";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import SelectColor from "./SelectColor.vue";

const isArchiveStore = useIsArchiveStore();
const authStore = useAuthStore();
const { isArchive } = storeToRefs(isArchiveStore);
const { accessToken } = storeToRefs(authStore);
const { toggleIsArchive } = isArchiveStore;
</script>

<template>
  <header v-if="accessToken" class="fixed top-10 w-full">
    <div
      class="flex justify-between px-4 items-center bg-gray-400 text-black py-2"
    >
      <button @click="toggleIsArchive">
        {{ isArchive ? "Unarchive Notes" : "Archived Notes" }}
      </button>
      <SelectColor />
    </div>
  </header>
</template>
