import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "../stores/auth";
import { refreshAccessTokenFn } from "@/api/authApi";
import { storeToRefs } from "pinia";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const authStore = useAuthStore();
  const { accessToken } = storeToRefs(authStore);
  const { setAccessToken } = authStore;

  if (!accessToken.value) {
    try {
      const response = await refreshAccessTokenFn();
      if (response) {
        setAccessToken(response.accessToken);
        return "/";
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (to.meta.requiresAuth && !accessToken.value) return "/login";
});

export default router;
