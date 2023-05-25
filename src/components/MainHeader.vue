<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useMutation } from "@tanstack/vue-query";
import { logoutUserFn } from "@/api/authApi";
import { createToast } from "mosha-vue-toastify";
import ChangeLanguage from "./ChangeLanguage.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

const auth = useAuthStore();

const { accessToken } = storeToRefs(auth);

const router = useRouter();

const { t } = useI18n();

const { mutate } = useMutation({
  mutationFn: logoutUserFn,
  onSuccess: () => {
    router.push({ name: "login" });
    auth.setAccessToken("");
    createToast(t("logout.success"), {
      position: "top-right",
      type: "success",
    });
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
  <header class="w-full">
    <div
      class="flex justify-between px-4 items-center bg-teal-700 text-white py-3"
    >
      <RouterLink to="/" class="text-lg font-bold md:text-xl"
        >Sticky Notes</RouterLink
      >

      <div class="flex gap-4 items-center">
        <ChangeLanguage />
        <nav v-if="!accessToken" class="flex gap-2">
          <RouterLink
            v-if="router.currentRoute.value.path == '/register'"
            to="/login"
            class="text-sm md:text-lg"
            >{{ $t("sign_up.actions.login") }}</RouterLink
          >
          <RouterLink
            v-if="router.currentRoute.value.path == '/login'"
            to="/register"
            class="text-sm md:text-lg"
            >{{ $t("sign_up.actions.register") }}</RouterLink
          >
        </nav>
        <v-icon
          v-else
          @click="handleLogout"
          name="hi-logout"
          class="cursor-pointer text-white w-7 h-7 mr-3 hover:text-red-400"
          :alt="$t('logout.action')"
          :aria-label="$t('logout.action')"
        >
        </v-icon>
      </div>
    </div>
  </header>
</template>
