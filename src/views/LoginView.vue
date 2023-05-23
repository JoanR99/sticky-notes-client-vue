<template>
  <section
    class="min-h-[90vh] mt-24 mb-2 max-w-xs m-auto md:max-w-sm lg:max-w-md"
  >
    <div>
      <h1 class="text-2xl lg:text-4xl text-center text-teal-600 mb-2 md:mb-4">
        {{ $t("login.title") }}
      </h1>
      <h2 class="text-md lg:text-lg text-center mb-2 md:mb-4 text-gray-600">
        {{ $t("login.sub_title") }}
      </h2>
      <form
        @submit="onSubmit"
        class="max-w-[27rem] mx-auto overflow-hidden shadow-lg bg-blue-200 rounded-2xl p-4 space-y-3 md:p-8 md:space-y-5"
      >
        <div>
          <label
            for="email"
            class="block text-black mb-2 md:mb-3 text-sm md:text-lg"
            >{{ $t("labels.email") }}</label
          >
          <input
            type="email"
            placeholder=" "
            v-model="email"
            class="block w-full rounded-2xl appearance-none focus:outline-none py-1 px-2 md:py-2 md:px-4"
            id="email"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            $t(errors.email ?? "")
          }}</span>
        </div>
        <div>
          <label
            for="password"
            class="block text-black mb-2 md:mb-3 text-sm md:text-lg"
            >{{ $t("labels.password") }}</label
          >
          <input
            v-model="password"
            type="password"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-1 px-2 md:py-2 md:px-4"
            id="password"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            $t(errors.password ?? "")
          }}</span>
        </div>

        <LoadingButton variant="fullwidth" :loading="isLoading">{{
          $t("login.actions.login")
        }}</LoadingButton>
        <span class="block text-sm md:text-lg"
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
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import LoadingButton from "../components/LoadingButton.vue";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const router = useRouter();

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
