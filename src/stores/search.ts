import { ref } from "vue";
import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", () => {
  const search = ref<string | undefined>(undefined);

  function setSearch(searchKey: string) {
    if (searchKey === "") {
      search.value = undefined;
      return;
    }

    search.value = searchKey;
  }

  return { search, setSearch };
});
