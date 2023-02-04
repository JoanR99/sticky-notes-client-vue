import { ref } from "vue";
import { defineStore } from "pinia";
import type { Color } from "@/schemas/noteSchemas";

export const useColorStore = defineStore("color", () => {
  const color = ref<Color | undefined>(undefined);

  function setColor(colorInput: Color | "all") {
    if (colorInput === "all") {
      color.value = undefined;
      return;
    }

    color.value = colorInput;
  }

  return { color, setColor };
});
