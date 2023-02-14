<template>
  <section class="min-h-screen grid place-items-center">
    <div>
      <h1
        class="text-4xl xl:text-6xl text-center font-[600] text-teal-600 mb-4"
      >
        {{ $t("login.title") }}
      </h1>
      <h2 class="text-lg text-center mb-4 text-gray-600">
        {{ $t("login.sub_title") }}
      </h2>
      <form
        @submit="onSubmit"
        class="max-w-[27rem] mx-auto overflow-hidden shadow-lg bg-blue-200 rounded-2xl p-8 space-y-5"
      >
        <div class="">
          <label for="email" class="block text-black mb-3">{{
            $t("labels.email")
          }}</label>
          <input
            type="email"
            placeholder=" "
            v-model="email"
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="email"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            $t(errors.email ?? "")
          }}</span>
        </div>
        <div class="">
          <label for="password" class="block text-black mb-3">{{
            $t("labels.password")
          }}</label>
          <input
            v-model="password"
            type="password"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="password"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            $t(errors.password ?? "")
          }}</span>
        </div>

        <LoadingButton variant="fullwidth" :loading="isLoading">{{
          $t("login.actions.login")
        }}</LoadingButton>
        <span class="block"
          >{{ $t("login.action_call") }}
          <router-link :to="{ name: 'register' }" class="text-pink-600">{{
            $t("login.actions.register")
          }}</router-link></span
        >
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { loginUserFn } from "../api/authApi";
import { loginUserSchema } from "../schemas/userSchemas";
import type { LoginUserInput } from "../schemas/userSchemas";
import { createToast } from "mosha-vue-toastify";
import router from "../router";
import { useAuthStore } from "../stores/auth";
import LoadingButton from "../components/LoadingButton.vue";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();

const loginSchema = toFormValidator(loginUserSchema);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: loginSchema,
});

const { value: email } = useField("email");
const { value: password } = useField("password");

const queryClient = useQueryClient();

const { t } = useI18n();

const { isLoading, mutate } = useMutation({
  mutationFn: (credentials: LoginUserInput) => loginUserFn(credentials),
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
  onSuccess: (data) => {
    queryClient.refetchQueries(["user"]);
    authStore.setAccessToken(data.accessToken);
    router.push({ name: "home" });
    createToast(t("login.success"), {
      position: "top-right",
      type: "success",
    });
  },
});

const onSubmit = handleSubmit((values) => {
  mutate({
    email: values.email,
    password: values.password,
  });
  resetForm();
});
</script>
