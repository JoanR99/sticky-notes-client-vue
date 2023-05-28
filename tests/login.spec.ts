import { test, expect, type Page, chromium } from "@playwright/test";

const baseURL = "http://localhost:5173/login";

test.describe("Login", () => {
  let browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto(baseURL);
  });

  test.afterAll(async () => {
    await page.close();
    await browser.close();
  });

  test("should login successfully", async () => {
    await page.route("http://localhost:5173/api/users/login", async (route) => {
      const json = {
        accessToken: "access-token",
      };
      await route.fulfill({ json });
    });

    await expect(page.getByText(/Welcome back/)).toBeVisible();

    const emailInput = page.getByRole("textbox", { name: "email" });
    expect(emailInput).toBeVisible();
    await emailInput.fill("admin@example.com");

    const passwordInput = page.getByRole("textbox", { name: "password" });
    expect(passwordInput).toBeVisible();
    await passwordInput.fill("admin");

    const submitButton = page.getByRole("button", { name: "Login" });
    expect(submitButton).toBeVisible();
    await submitButton.click();

    await page.waitForURL("**/");

    const logoutButton = page.getByLabel("Logout");
    expect(logoutButton).toBeVisible();

    const archivedButton = page.getByRole("button", { name: /Archived Notes/ });
    expect(archivedButton).toBeVisible();

    const searchInput = page.getByRole("textbox", { name: "search" });
    expect(searchInput).toBeVisible();
  });
});
