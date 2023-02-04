<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import NoteCard from "@/components/NoteCard.vue";
import { getNotesFn } from "../api/authApi";
import { useIsArchiveStore } from "../stores/isArchive";
import { storeToRefs } from "pinia";

const isArchiveStore = useIsArchiveStore();

const { isArchive } = storeToRefs(isArchiveStore);

const color = undefined;
const search = undefined;

const { status, data } = useQuery({
  queryKey: ["notes", { isArchive, color, search }],
  queryFn: async () =>
    await getNotesFn({
      isArchive: isArchive.value,
      color,
      search,
    }),
  staleTime: 60000,
  refetchOnWindowFocus: false,
});
</script>

<template>
  <main>
    <div class="grid grid-cols-4 gap-4 p-8 px-40 mt-16">
      <p v-if="status === 'loading'">Loading...</p>
      <p v-else-if="status === 'error'">Error</p>
      <NoteCard
        v-else-if="data"
        v-for="note in data"
        v-bind:key="note.id"
        :note="note"
      />
    </div>
  </main>
</template>
