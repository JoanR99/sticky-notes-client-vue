import { refreshAccessTokenFn } from "@/api/authApi";
import type { NavigationGuardNext, Router } from "vue-router";

export default async function requireAuth({
  next,
  authStore,
  router,
}: {
  next: NavigationGuardNext;
  authStore: any;
  router: Router;
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
