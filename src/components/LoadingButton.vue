<template>
  <button
    type="submit"
    class="py-2 font-semibold bg-pink-600 rounded-lg outline-none border-none flex justify-center"
    :class="variant === 'fullwidth' ? 'w-full' : 'px-3'"
    :disabled="loading"
    :style="[loading ? { backgroundColor: '#ccc' } : {}]"
  >
    <div v-if="loading" class="flex items-center gap-3">
      <Spinner />
    </div>
    <span v-else class="text-white"><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import Spinner from "./SpinnerSVG.vue";
defineProps<{
  loading: boolean;
  variant: "fullwidth" | "normal";
}>();
</script>
