import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";

import { useAuthStore } from "../stores/auth";
import middlewarePipeline from "./middlewarePipeline";
import { routes } from "./routes";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
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
      router,
    };

    return middleware[0]({
      ...context,
      next: middlewarePipeline(context, middleware, 1),
    });
  }
);
