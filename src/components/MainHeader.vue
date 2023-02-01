<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <header>
    <div
      class="flex justify-between px-4 items-center bg-teal-700 text-white py-2"
    >
      <RouterLink to="/" class="text-xl font-bold">Sticky Notes</RouterLink>
      <nav class="flex gap-2">
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Sign Up</RouterLink>
      </nav>
    </div>
  </header>
</template>
