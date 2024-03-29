<template>
  <section
    class="min-h-[90vh] mt-24 mb-2 max-w-xs m-auto md:max-w-sm lg:max-w-md"
  >
    <div>
      <h1 class="text-2xl lg:text-4xl text-center text-teal-600 mb-2 md:mb-4">
        {{ $t("sign_up.title") }}
      </h1>
      <h2 class="text-md lg:text-lg text-center mb-2 md:mb-4 text-gray-600">
        {{ $t("sign_up.sub_title") }}
      </h2>
      <form
        @submit="onSubmit"
        class="max-w-[27rem] mx-auto overflow-hidden shadow-lg bg-blue-200 rounded-2xl p-4 space-y-3 md:p-8 md:space-y-5"
      >
        <div class="">
          <label
            for="username"
            class="block text-black mb-2 md:mb-3 text-sm md:text-lg"
            >{{ $t("labels.username") }}</label
          >
          <input
            v-model="username"
            type="text"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-1 px-2 md:py-2 md:px-4"
            id="username"
            name="username"
          />
          <ErrorMessage name="username" v-slot="{ message }">
            <span class="text-red-500 text-xs pt-1 block">{{
              $t(message!)
            }}</span>
          </ErrorMessage>
        </div>
        <div class="">
          <label
            for="email"
            class="block text-black mb-2 md:mb-3 text-sm md:text-lg"
            >{{ $t("labels.email") }}</label
          >
          <input
            v-model="email"
            type="email"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-1 px-2 md:py-2 md:px-4"
            id="email"
            name="email"
          />
          <ErrorMessage name="email" v-slot="{ message }">
            <span class="text-red-500 text-xs pt-1 block">{{
              $t(message!)
            }}</span>
          </ErrorMessage>
        </div>
        <div class="">
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
            name="password"
          />
          <ErrorMessage name="password" v-slot="{ message }">
            <span class="text-red-500 text-xs pt-1 block">{{
              $t(message!)
            }}</span>
          </ErrorMessage>
        </div>
        <div class="">
          <label
            for="passwordConfirm"
            class="block text-black mb-2 md:mb-3 text-sm md:text-lg"
            >{{ $t("labels.confirm_password") }}</label
          >
          <input
            v-model="passwordConfirm"
            type="password"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-1 px-2 md:py-2 md:px-4"
            id="passwordConfirm"
            name="passwordConfirm"
          />
          <ErrorMessage name="passwordConfirm" v-slot="{ message }">
            <span class="text-red-500 text-xs pt-1 block">{{
              $t(message!)
            }}</span>
          </ErrorMessage>
        </div>

        <LoadingButton variant="fullwidth" :loading="isLoading">{{
          $t("sign_up.actions.register")
        }}</LoadingButton>

        <span class="block text-sm md:text-lg"
          >{{ $t("sign_up.action_call") }}
          <router-link :to="{ name: 'login' }" class="text-pink-600">{{
            $t("sign_up.actions.login")
          }}</router-link></span
        >
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useField, useForm, ErrorMessage } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { useMutation } from "@tanstack/vue-query";
import { signUpUserFn } from "@/api/authApi";
import { createToast } from "mosha-vue-toastify";
import { useRouter } from "vue-router";
import LoadingButton from "../components/LoadingButton.vue";
import {
  type RegisterUser,
  registerUserSchemaInput,
} from "@/schemas/userSchemas";
import { useI18n } from "vue-i18n";

const registerSchema = toFormValidator(registerUserSchemaInput);
const router = useRouter();

const { handleSubmit, resetForm } = useForm({
  validationSchema: registerSchema,
});

const { value: username } = useField("username");
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: passwordConfirm } = useField("passwordConfirm");

const { t } = useI18n();

const { isLoading, mutate } = useMutation({
  mutationFn: (credentials: RegisterUser) => signUpUserFn(credentials),
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
  onSuccess: () => {
    router.push({ name: "login" });
    createToast(t("sign_up.success"), {
      position: "top-right",
      type: "success",
    });
  },
});

const onSubmit = handleSubmit((values) => {
  mutate({
    username: values.username,
    email: values.email,
    password: values.password,
  });
  resetForm();
});
</script>
