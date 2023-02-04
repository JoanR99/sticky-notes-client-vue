<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import NoteCard from "@/components/NoteCard.vue";
import { getNotesFn } from "../api/authApi";
import { useIsArchiveStore } from "../stores/isArchive";
import { storeToRefs } from "pinia";
import { useColorStore } from "../stores/color";
import { useSearchStore } from "../stores/search";
import CreateNoteVue from "@/components/CreateNote.vue";

const isArchiveStore = useIsArchiveStore();

const { isArchive } = storeToRefs(isArchiveStore);

const colorStore = useColorStore();
const { color } = storeToRefs(colorStore);

const searchStore = useSearchStore();
const { search } = storeToRefs(searchStore);

const { status, data } = useQuery({
  queryKey: ["notes", { isArchive, color, search }],
  queryFn: async () =>
    await getNotesFn({
      isArchive: isArchive.value,
      color: color.value,
      search: search.value,
    }),
  staleTime: 60000,
  refetchOnWindowFocus: false,
});
</script>

<template>
  <main>
    <div class="grid grid-cols-4 gap-6 p-8 px-40 mt-24">
      <p v-if="status === 'loading'">Loading...</p>
      <p v-else-if="status === 'error'">Error</p>
      <NoteCard
        v-else-if="data"
        v-for="note in data"
        v-bind:key="note.id"
        :note="note"
      />
    </div>
    <CreateNoteVue />
  </main>
</template>
