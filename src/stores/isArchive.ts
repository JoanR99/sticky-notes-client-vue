import { ref } from "vue";
import { defineStore } from "pinia";

export const useIsArchiveStore = defineStore("isArchive", () => {
  const isArchive = ref<boolean>(false);

  function toggleIsArchive() {
    isArchive.value = !isArchive.value;
  }

  return { isArchive, toggleIsArchive };
});
