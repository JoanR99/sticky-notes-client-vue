<script setup lang="ts">
import NoteCard from "@/components/NoteCard.vue";

const notes = [
  {
    id: 1,
    title: "Joan",
    content: "Recuerda",
    color: "blue",
  },
  {
    id: 2,
    title: "Joan",
    content: "Recuerda",
    color: "blue",
  },
];
</script>

<template>
  <main>
    <div class="grid grid-cols-4 gap-4 p-8 px-40">
      <NoteCard v-for="note in notes" v-bind:key="note.id" :note="note" />
    </div>
  </main>
</template>
