import { refreshAccessTokenFn } from "@/api/authApi";
import type { NavigationGuardNext } from "vue-router";
import router from "..";

export default async function requireAuth({
  next,
  authStore,
}: {
  next: NavigationGuardNext;
  authStore: any;
}) {
  try {
    const { accessToken } = await refreshAccessTokenFn();

    if (!accessToken) {
      return next({
        name: "login",
      });
    }

    authStore.setAccessToken(accessToken);
  } catch (error) {
    router.push("/login");
  }

  return next();
}
