import { test, expect, chromium } from "@playwright/test";
import { getNotesFromParams, notes } from "./utils";

const baseURL = "http://localhost:5173";

test.describe("Logout", () => {
  let browser;
  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/users/refresh", async (route) => {
      const json = {
        accessToken: "access-token",
      };
      await route.fulfill({ json });
    });

    await page.route("**/api/users/logout", async (route) => {
      await route.fulfill({ status: 200 });
    });
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

  test("should redirect to login when logout button is clicked", async ({
    page,
  }) => {
    await page.goto(baseURL);

    await page.waitForSelector("article");

    const logoutButton = page.getByLabel("Logout");
    expect(logoutButton).toBeVisible();

    await logoutButton.click();

    await page.waitForURL(`${baseURL}/login`);

    expect(page.url()).toBe(`${baseURL}/login`);

    await expect(page.getByText(/Welcome back/)).toBeVisible();
  });
});
