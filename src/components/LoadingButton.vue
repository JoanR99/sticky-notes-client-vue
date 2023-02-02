<template>
  <button
    type="submit"
    class="w-full py-3 font-semibold bg-pink-600 rounded-lg outline-none border-none flex justify-center"
    :disabled="loading"
    :style="[loading ? { backgroundColor: '#ccc' } : {}]"
  >
    <div v-if="loading" class="flex items-center gap-3">
      <Spinner />
      <span class="text-blue-600">Loading...</span>
    </div>
    <span v-else class="text-white"><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import Spinner from "./SpinnerSVG.vue";
defineProps<{
  loading: boolean;
}>();
</script>
