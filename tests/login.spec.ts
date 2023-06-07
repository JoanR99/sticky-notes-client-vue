import { test, expect, chromium } from "@playwright/test";
import { LoginUserInput } from "../src/schemas/userSchemas";
import { getNotesFromParams, notes } from "./utils";

const baseURL = "http://localhost:5173/login";

const userCredentials: LoginUserInput = {
  email: "admin@example.com",
  password: "#4Dm1nUs3r",
};

test.describe("Login", () => {
  let browser;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should call login endpoint with correct input when login button is clicked", async ({
    page,
  }) => {
    await page.goto(baseURL);
    await page.route("http://localhost:5173/api/users/login", async (route) => {
      const data = route.request().postDataJSON();
      expect(data).toEqual({
        email: userCredentials.email,
        password: userCredentials.password,
      });
      const json = {
        accessToken: "access-token",
      };
      await route.fulfill({ json });
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

    await expect(page.getByText(/Welcome back/)).toBeVisible();

    const emailInput = page.getByRole("textbox", { name: "email" });
    expect(emailInput).toBeVisible();
    await emailInput.fill(userCredentials.email);

    const passwordInput = page.getByRole("textbox", { name: "password" });
    expect(passwordInput).toBeVisible();
    await passwordInput.fill(userCredentials.password);

    const submitButton = page.getByRole("button", { name: "Login" });
    expect(submitButton).toBeVisible();
    await submitButton.click();

    await page.waitForSelector("article");

    const logoutButton = page.getByLabel("Logout");
    expect(logoutButton).toBeVisible();
  });
});
