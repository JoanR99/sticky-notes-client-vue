<script setup lang="ts">
import { useIsArchiveStore } from "../stores/isArchive";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import SelectColor from "./SelectColor.vue";
import SearchBar from "./SearchBar.vue";
import { useQueryClient } from "@tanstack/vue-query";

const isArchiveStore = useIsArchiveStore();
const authStore = useAuthStore();
const { isArchive } = storeToRefs(isArchiveStore);
const { accessToken } = storeToRefs(authStore);
const { toggleIsArchive } = isArchiveStore;
const queryClient = useQueryClient();

const onClick = () => {
  toggleIsArchive();
  queryClient.invalidateQueries(["notes"]);
};
</script>

<template>
  <header v-if="accessToken" class="w-full z-0">
    <div
      class="flex justify-between px-4 items-center bg-gray-200 text-black py-2"
    >
      <button @click="onClick" class="text-blue-600">
        {{
          isArchive ? $t("second_header.notes") : $t("second_header.archived")
        }}
      </button>

      <SearchBar />

      <SelectColor />
    </div>
  </header>
</template>
