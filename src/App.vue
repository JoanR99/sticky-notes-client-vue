<script setup lang="ts">
import { RouterView } from "vue-router";
import MainHeader from "./components/MainHeader.vue";
import SecondaryHeader from "./components/SecondaryHeader.vue";
</script>

<template>
  <MainHeader />
  <SecondaryHeader />

  <RouterView />
</template>
