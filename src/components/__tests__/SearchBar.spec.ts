import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SearchBar from "../SearchBar.vue";
import { createPinia } from "pinia";
import type { InputHTMLAttributes } from "vue";

describe("Search BarP", () => {
  it("it should show input and button", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        mocks: {
          $t: (message: string) => message,
        },
        plugins: [createPinia()],
      },
    });

    expect(wrapper.get("input[name='search']")).toBeDefined();
    expect(wrapper.get("button[type='submit']")).toBeDefined();
  });

  it("should clear input after submit", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        mocks: {
          $t: (message: string) => message,
        },
        plugins: [createPinia()],
      },
    });

    await wrapper.get("input[name='search']").setValue("hello");

    expect(
      (wrapper.get("input[name='search']").element as InputHTMLAttributes).value
    ).toBe("hello");

    await wrapper.get("form").trigger("submit");

    expect(
      (wrapper.get("input[name='search']").element as InputHTMLAttributes).value
    ).toBe("");
  });
});
