<template>
  <section class="py-8 min-h-screen grid place-items-center">
    <div>
      <h1
        class="text-4xl xl:text-6xl text-center font-[600] text-teal-600 mb-4 mt-12"
      >
        Welcome to Sticky Notes!
      </h1>
      <h2 class="text-lg text-center mb-4 text-gray-600">
        Sign Up To Get Started!
      </h2>
      <form
        @submit="onSubmit"
        class="max-w-[27rem] mx-auto overflow-hidden shadow-lg bg-blue-200 rounded-2xl p-8 space-y-5"
      >
        <div class="">
          <label for="name" class="block text-black mb-3">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="name"
          />
          <span class="text-red-500 text-xs pt-1 block">{{ errors.name }}</span>
        </div>
        <div class="">
          <label for="email" class="block text-black mb-3">Email Address</label>
          <input
            v-model="email"
            type="email"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="email"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            errors.email
          }}</span>
        </div>
        <div class="">
          <label for="password" class="block text-black mb-3">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="password"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            errors.password
          }}</span>
        </div>
        <div class="">
          <label for="passwordConfirm" class="block text-black mb-3"
            >Confirm Password</label
          >
          <input
            v-model="passwordConfirm"
            type="password"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="passwordConfirm"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            errors.passwordConfirm
          }}</span>
        </div>
        <span class="block"
          >Already have an account?
          <router-link :to="{ name: 'login' }" class="text-pink-600"
            >Login Here</router-link
          ></span
        >
        <LoadingButton variant="fullwidth" :loading="isLoading"
          >Sign Up</LoadingButton
        >
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { useMutation } from "@tanstack/vue-query";
import { signUpUserFn } from "@/api/authApi";
import { createToast } from "mosha-vue-toastify";
import router from "@/router";
import LoadingButton from "../components/LoadingButton.vue";
import { registerUserSchema, type RegisterUser } from "@/schemas/userSchemas";

const registerSchema = toFormValidator(registerUserSchema);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: registerSchema,
});

const { value: username } = useField("username");
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: passwordConfirm } = useField("passwordConfirm");

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
    createToast("Sign up success", {
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
