import { test, expect, chromium } from "@playwright/test";
import { getNotesFromParams, notes } from "./utils";

const baseURL = "http://localhost:5173";

test.describe("Home", () => {
  let browser;
  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/notes**", async (route) => {
      const requestUrl = route.request().url();
      const responseBody = getNotesFromParams(requestUrl, notes);
      if (responseBody) {
        route.fulfill({
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(responseBody),
        });
      }
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should redirect to login when there is no access token", async ({
    page,
  }) => {
    await page.route("**/api/users/refresh", async (route) => {
      await route.fulfill({ status: 403 });
    });
    await page.goto(baseURL);
    await expect(page.getByText(/Welcome back/)).toBeVisible();

    const emailInput = page.getByRole("textbox", { name: "email" });
    expect(emailInput).toBeVisible();

    const passwordInput = page.getByRole("textbox", { name: "password" });
    expect(passwordInput).toBeVisible();

    const submitButton = page.getByRole("button", { name: "Login" });
    expect(submitButton).toBeVisible();
  });

  test.describe("Notes", () => {
    test("should show user notes when there is and access token", async ({
      page,
    }) => {
      await page.route("**/api/users/refresh", async (route) => {
        const json = {
          accessToken: "access-token",
        };
        await route.fulfill({ json });
      });

      await page.goto(baseURL);

      expect(page.url()).toBe("http://localhost:5173/");

      await page.waitForSelector("article");

      const note = page.locator("article").filter({ hasText: /title/ });
      expect(note).toBeVisible();
    });

    test("should show user archived notes when Archived Notes link is clicked", async ({
      page,
    }) => {
      await page.route("**/api/users/refresh", async (route) => {
        const json = {
          accessToken: "access-token",
        };
        await route.fulfill({ json });
      });

      await page.goto(baseURL);

      expect(page.url()).toBe("http://localhost:5173/");

      const archivedButton = page.getByRole("button", {
        name: /Archived Notes/,
      });
      expect(archivedButton).toBeVisible();

      await archivedButton.click();

      await page.waitForSelector("article");

      const note = page.getByRole("article").filter({ hasText: /cat/ });

      expect(note).toBeVisible();
    });
  });
});
