import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(null);

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  return { accessToken, setAccessToken };
});
