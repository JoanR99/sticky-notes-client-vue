import type { RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { authGuard } from "./authGuard";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: [authGuard],
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
];
