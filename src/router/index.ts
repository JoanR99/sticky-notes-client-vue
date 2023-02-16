import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "../stores/auth";
import middlewarePipeline from "./middlewarePipeline";
import requireAuth from "./middlewares/requireAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        middleware: [requireAuth],
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

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    if (!to.meta.middleware) {
      return next();
    }
    const middleware = to.meta.middleware as any;

    const context = {
      to,
      from,
      next,
      authStore,
    };

    return middleware[0]({
      ...context,
      next: middlewarePipeline(context, middleware, 1),
    });
  }
);

export default router;
