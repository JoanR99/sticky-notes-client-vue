import { test, expect, chromium } from "@playwright/test";
import { RegisterUserInput } from "../src/schemas/userSchemas";

const baseURL = "http://localhost:5173";

const userCredentials: RegisterUserInput = {
  username: "admin",
  email: "admin@example.com",
  password: "#4Dm1nUs3r",
  passwordConfirm: "#4Dm1nUs3r",
};

test.describe("Register", () => {
  let browser;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should call register endpoint with correct input when register button is clicked", async ({
    page,
  }) => {
    await page.goto(`${baseURL}/register`);
    await page.route("**/api/users", async (route) => {
      const data = route.request().postDataJSON();
      expect(data).toEqual({
        username: userCredentials.username,
        email: userCredentials.email,
        password: userCredentials.password,
      });
      const json = {
        message: "User created successfully",
      };
      await route.fulfill({ json });
    });

    await expect(page.getByText(/Welcome/)).toBeVisible();

    const usernameInput = page.getByRole("textbox", { name: "username" });
    expect(usernameInput).toBeVisible();
    await usernameInput.fill(userCredentials.username);

    const emailInput = page.getByRole("textbox", { name: "email" });
    expect(emailInput).toBeVisible();
    await emailInput.fill(userCredentials.email);

    const passwordInput = page.getByLabel("Password", { exact: true });
    expect(passwordInput).toBeVisible();
    await passwordInput.fill(userCredentials.password);

    const passwordConfirmInput = page.getByLabel("Confirm your password");
    expect(passwordConfirmInput).toBeVisible();
    await passwordConfirmInput.fill(userCredentials.passwordConfirm);

    const submitButton = page.getByRole("button", { name: "Sign Up" });
    expect(submitButton).toBeVisible();
    await submitButton.click();

    await page.waitForURL(`${baseURL}/login`);

    await expect(page.getByText(/Welcome back/)).toBeVisible();
  });
});
