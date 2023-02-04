<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useMutation } from "@tanstack/vue-query";
import { logoutUserFn } from "@/api/authApi";
import { createToast } from "mosha-vue-toastify";

const authStore = useAuthStore();

const { mutate } = useMutation({
  mutationFn: logoutUserFn,
  onSuccess: () => {
    authStore.setAccessToken("");
    document.location.href = "/login";
  },
  onError: (error) => {
    if (Array.isArray((error as any).response.data.error)) {
      (error as any).response.data.error.forEach((el: any) =>
        createToast(el.message, {
          position: "top-right",
          type: "warning",
        })
      );
    } else {
      createToast((error as any).response.data.message, {
        position: "top-right",
        type: "danger",
      });
    }
  },
});

const handleLogout = () => mutate();
</script>

<template>
  <header class="fixed top-0 w-full">
    <div
      class="flex justify-between px-4 items-center bg-teal-700 text-white py-3"
    >
      <RouterLink to="/" class="text-xl font-bold">Sticky Notes</RouterLink>
      <nav v-if="!authStore.accessToken" class="flex gap-2">
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Sign Up</RouterLink>
      </nav>
      <p v-else @click="handleLogout" class="cursor-pointer">Logout</p>
    </div>
  </header>
</template>
