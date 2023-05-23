import HomeView from "../views/HomeView.vue";
import requireAuth from "./middlewares/requireAuth";

export const routes = [
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
];
