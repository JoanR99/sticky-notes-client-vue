<template>
  <form class="flex gap-2" @submit.prevent="handleSubmit">
    <input
      v-model="searchInput"
      type="text"
      name="search"
      :placeholder="$t('search.placeholder')"
      class="w-24 lg:w-52 text-sm md:text-md rounded-xl p-1 px-2 outline-none shadow-sm shadow-gray-500"
      autocomplete="off"
    />
    <button type="submit">
      <v-icon name="fa-search" class="text-gray-600 hover:text-gray-400" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSearchStore } from "../stores/search";

const searchStore = useSearchStore();

const { setSearch } = searchStore;

const searchInput = ref("");

const handleSubmit = () => {
  setSearch(searchInput.value);
  searchInput.value = "";
};
</script>
