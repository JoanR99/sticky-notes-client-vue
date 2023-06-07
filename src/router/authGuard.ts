import { refreshAccessTokenFn } from "@/api/authApi";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  try {
    const authStore = useAuthStore();
    const { accessToken } = storeToRefs(authStore);
    if (!accessToken.value) {
      const { accessToken: newAccessToken } = await refreshAccessTokenFn();

      if (!newAccessToken) {
        return next({
          name: "login",
        });
      }

      authStore.setAccessToken(newAccessToken);
    }
    return next();
  } catch (error) {
    return next({
      name: "login",
    });
  }
}
