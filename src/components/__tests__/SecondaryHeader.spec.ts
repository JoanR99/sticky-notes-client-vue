import { describe, expect, it } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import SecondaryHeader from "../SecondaryHeader.vue";
import i18n, { createI18nInstance } from "../../locales/i18n";
import { VueQueryPlugin } from "@tanstack/vue-query";

describe("Main Header", () => {
  it("it should display Archived Notes when isArchive is false", async () => {
    const wrapper = await mount(SecondaryHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "sfdafdfasf",
              },
              isArchive: {
                isArchive: false,
              },
            },
          }),
          i18n,
          VueQueryPlugin,
        ],
      },
    });

    expect(wrapper.get("button").text()).toBe("Archived Notes");
  });

  it("it should display My Notes when isArchive is false", async () => {
    const wrapper = await mount(SecondaryHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "sfdafdfasf",
              },
              isArchive: {
                isArchive: true,
              },
            },
          }),
          i18n,
          VueQueryPlugin,
        ],
      },
    });

    expect(wrapper.get("button").text()).toBe("My Notes");
  });

  it("it should display Notas Archivadas when isArchive is false", async () => {
    const wrapper = await mount(SecondaryHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "sfdafdfasf",
              },
              isArchive: {
                isArchive: false,
              },
            },
          }),
          createI18nInstance("es"),
          VueQueryPlugin,
        ],
      },
    });

    expect(wrapper.get("button").text()).toBe("Notas Archivadas");
  });

  it("it should display Notas Archivadas when isArchive is false", async () => {
    const wrapper = await mount(SecondaryHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "sfdafdfasf",
              },
              isArchive: {
                isArchive: true,
              },
            },
          }),
          createI18nInstance("es"),
          VueQueryPlugin,
        ],
      },
    });

    expect(wrapper.get("button").text()).toBe("Mis Notas");
  });

  it("it should not display the component when accessToken is null", async () => {
    const wrapper = await mount(SecondaryHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                accessToken: "",
              },
              isArchive: {
                isArchive: true,
              },
            },
          }),
          createI18nInstance("es"),
          VueQueryPlugin,
        ],
      },
    });

    expect(wrapper.findAll("header").length).toBe(0);
  });
});
