<script setup lang="ts">
import { RouterView } from "vue-router";
import MainHeader from "./components/MainHeader.vue";
import SecondaryHeader from "./components/SecondaryHeader.vue";
</script>

<template>
  <div class="fixed top-0 w-full">
    <MainHeader />
    <SecondaryHeader />
  </div>

  <RouterView />
</template>
