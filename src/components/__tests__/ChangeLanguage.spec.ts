import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ChangeLanguage from "../ChangeLanguage.vue";
import * as VueI18n from "vue-i18n";

const i18n = VueI18n.createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  availableLocales: ["en", "es"],
  messages: {
    en: { hello: "hello" },
    es: { hello: "hola" },
  },
});

describe("Change Language", () => {
  it("it should have english language by default", async () => {
    const wrapper = mount(ChangeLanguage, {
      global: {
        plugins: [i18n],
      },
    });

    expect(wrapper.get("button").text()).toBe("en");
  });

  it("should display english and spanish options on click", async () => {
    const wrapper = mount(ChangeLanguage, {
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.get("button").trigger("click");

    expect(wrapper.findAll("li")).toHaveLength(2);

    expect(wrapper.get('[aria-selected="true"]').text()).toBe("en");
    expect(wrapper.get('[aria-selected="false"]').text()).toBe("es");
  });

  it("should change to spanish on option click", async () => {
    const wrapper = mount(ChangeLanguage, {
      global: {
        plugins: [i18n],
      },
    });

    await wrapper.get("button").trigger("click");

    await wrapper.get('[aria-selected="false"]').trigger("click");

    expect(wrapper.get("button").text()).toBe("es");

    await wrapper.get("button").trigger("click");

    expect(wrapper.get('[aria-selected="true"]').text()).toBe("es");
    expect(wrapper.get('[aria-selected="false"]').text()).toBe("en");
  });
});
