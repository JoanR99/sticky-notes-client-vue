import { describe, expect, it, beforeEach } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import MainHeader from "../MainHeader.vue";
import { OhVueIcon } from "oh-vue-icons";
import { createRouter, createWebHistory, type Router } from "vue-router";
import i18n from "../../locales/i18n";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { routes } from "@/router/routes";

let router: Router;

beforeEach(async () => {
  router = createRouter({
    history: createWebHistory(),
    routes: routes,
  });
});

describe("Main Header", () => {
  it("it should display logout option on home route when there is a user authenticated", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = await mount(MainHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "sfdafdfasf",
              },
            },
          }),
          i18n,
          VueQueryPlugin,
        ],
        components: {
          "v-icon": OhVueIcon,
        },
      },
    });

    expect(wrapper.get("a[href='/']").text()).toBe("Sticky Notes");
    expect(router.currentRoute.value.path).toBe("/");
    expect(wrapper.get("svg[aria-label='Logout']")).toBeDefined();
  });

  it("it should display login option on register route", async () => {
    router.push("/register");
    await router.isReady();
    const wrapper = await mount(MainHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "",
              },
            },
          }),
          i18n,
          VueQueryPlugin,
        ],
        components: {
          "v-icon": OhVueIcon,
        },
      },
    });

    expect(wrapper.get("a[href='/']").text()).toBe("Sticky Notes");
    expect(router.currentRoute.value.path).toBe("/register");
    expect(wrapper.get("a[href='/login']").text()).toBe("Login");
  });

  it("it should display register option on login route", async () => {
    router.push("/login");
    await router.isReady();
    const wrapper = await mount(MainHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "",
              },
            },
          }),
          i18n,
          VueQueryPlugin,
        ],
        components: {
          "v-icon": OhVueIcon,
        },
      },
    });

    expect(wrapper.get("a[href='/']").text()).toBe("Sticky Notes");
    expect(router.currentRoute.value.path).toBe("/login");
    expect(wrapper.get("a[href='/register']").text()).toBe("Sign Up");
  });

  it("it should display login option in Spanish on register route when there is the case", async () => {
    router.push("/register");
    await router.isReady();
    const wrapper = await mount(MainHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "",
              },
            },
          }),
          i18n,
          VueQueryPlugin,
        ],
        components: {
          "v-icon": OhVueIcon,
        },
      },
    });

    await wrapper.get("button").trigger("click");

    await wrapper.get('[aria-selected="false"]').trigger("click");

    expect(wrapper.get("button").text()).toBe("es");

    expect(wrapper.get("a[href='/']").text()).toBe("Sticky Notes");
    expect(router.currentRoute.value.path).toBe("/register");
    expect(wrapper.get("a[href='/login']").text()).toBe("Inicia Sesión");
  });

  it("it should display register option in Spanish on login route when there is the case", async () => {
    router.push("/login");
    await router.isReady();
    const wrapper = await mount(MainHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "",
              },
            },
          }),
          i18n,
          VueQueryPlugin,
        ],
        components: {
          "v-icon": OhVueIcon,
        },
      },
    });

    expect(wrapper.get("button").text()).toBe("es");

    expect(wrapper.get("a[href='/']").text()).toBe("Sticky Notes");
    expect(router.currentRoute.value.path).toBe("/login");
    expect(wrapper.get("a[href='/register']").text()).toBe("Regístrate");
  });
});
