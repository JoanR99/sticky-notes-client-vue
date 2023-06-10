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

  test.beforeEach(async ({ page }) => {
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
  });

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should call register endpoint with correct input when register button is clicked", async ({
    page,
  }) => {
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

  test.describe("Validation", async () => {
    test("should show username missing error when register button is clicked and username field is empty", async ({
      page,
    }) => {
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

      await page.waitForTimeout(1000);

      const usernameError = page.getByText("Username is required");
      expect(usernameError).toBeVisible();
    });

    test("should show email missing error when register button is clicked and email field is empty", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill(userCredentials.username);

      const passwordInput = page.getByLabel("Password", { exact: true });
      expect(passwordInput).toBeVisible();
      await passwordInput.fill(userCredentials.password);

      const passwordConfirmInput = page.getByLabel("Confirm your password");
      expect(passwordConfirmInput).toBeVisible();
      await passwordConfirmInput.fill(userCredentials.passwordConfirm);

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const emailError = page.getByText("Email is required");
      expect(emailError).toBeVisible();
    });

    test("should show password missing error when register button is clicked and password field is empty", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill(userCredentials.username);

      const emailInput = page.getByRole("textbox", { name: "email" });
      expect(emailInput).toBeVisible();
      await emailInput.fill(userCredentials.email);

      const passwordConfirmInput = page.getByLabel("Confirm your password");
      expect(passwordConfirmInput).toBeVisible();
      await passwordConfirmInput.fill(userCredentials.passwordConfirm);

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const passwordError = page.getByText("Password is required");
      expect(passwordError).toBeVisible();
    });

    test("should show password confirm missing error when register button is clicked and password confirm field is empty", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill(userCredentials.username);

      const emailInput = page.getByRole("textbox", { name: "email" });
      expect(emailInput).toBeVisible();
      await emailInput.fill(userCredentials.email);

      const passwordInput = page.getByLabel("Password", { exact: true });
      expect(passwordInput).toBeVisible();
      await passwordInput.fill(userCredentials.password);

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const passwordConfirmError = page.getByText(
        "Password confirm is required"
      );
      expect(passwordConfirmError).toBeVisible();
    });

    test("should show missing errors when register button is clicked and all fields are empty", async ({
      page,
    }) => {
      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const usernameError = page.getByText("Username is required");
      expect(usernameError).toBeVisible();
      const emailError = page.getByText("Email is required");
      expect(emailError).toBeVisible();
      const passwordError = page.getByText("Password is required");
      expect(passwordError).toBeVisible();
      const passwordConfirmError = page.getByText(
        "Password confirm is required"
      );
      expect(passwordConfirmError).toBeVisible();
    });

    test("should show Username must be 2 or more characters when username is less than 2 characters ", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill("a");

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

      await page.waitForTimeout(1000);

      const usernameError = page.getByText(
        "Username must be 2 or more characters"
      );
      expect(usernameError).toBeVisible();
    });

    test("should show Username must be less than 20 characters when username is more than 20 characters ", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill("aaaaaaaaaaaaaaaaaaaaa");

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

      await page.waitForTimeout(1000);

      const usernameError = page.getByText(
        "Username must be less than 20 characters"
      );
      expect(usernameError).toBeVisible();
    });

    test("should show Email is invalid when email is invalid", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill(userCredentials.username);

      const emailInput = page.getByRole("textbox", { name: "email" });
      expect(emailInput).toBeVisible();
      await emailInput.fill("hello");

      const passwordInput = page.getByLabel("Password", { exact: true });
      expect(passwordInput).toBeVisible();
      await passwordInput.fill(userCredentials.password);

      const passwordConfirmInput = page.getByLabel("Confirm your password");
      expect(passwordConfirmInput).toBeVisible();
      await passwordConfirmInput.fill(userCredentials.passwordConfirm);

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const emailError = page.getByText("Email is invalid");
      expect(emailError).toBeVisible();
    });

    test("should show Password must be 8 or more characters when password is less than 8 characters ", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill(userCredentials.username);

      const emailInput = page.getByRole("textbox", { name: "email" });
      expect(emailInput).toBeVisible();
      await emailInput.fill(userCredentials.email);

      const passwordInput = page.getByLabel("Password", { exact: true });
      expect(passwordInput).toBeVisible();
      await passwordInput.fill("hello");

      const passwordConfirmInput = page.getByLabel("Confirm your password");
      expect(passwordConfirmInput).toBeVisible();
      await passwordConfirmInput.fill("hello");

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const usernameError = page.getByText(
        "Password must be 8 or more characters"
      );
      expect(usernameError).toBeVisible();
    });

    test("should show Password must be less than 24 characters when password is less than 24 characters ", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill(userCredentials.username);

      const emailInput = page.getByRole("textbox", { name: "email" });
      expect(emailInput).toBeVisible();
      await emailInput.fill(userCredentials.email);

      const passwordInput = page.getByLabel("Password", { exact: true });
      expect(passwordInput).toBeVisible();
      await passwordInput.fill("hellohowareyouimgoodandyou?");

      const passwordConfirmInput = page.getByLabel("Confirm your password");
      expect(passwordConfirmInput).toBeVisible();
      await passwordConfirmInput.fill("hellohowareyouimgoodandyou?");

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const usernameError = page.getByText(
        "Password must be less than 24 characters"
      );
      expect(usernameError).toBeVisible();
    });

    test("should show Password must contain at least a lowercase letter, a uppercase letter, a number and a special character ( ! @ # $ % ) when password does not match pattern", async ({
      page,
    }) => {
      const usernameInput = page.getByRole("textbox", { name: "username" });
      expect(usernameInput).toBeVisible();
      await usernameInput.fill(userCredentials.username);

      const emailInput = page.getByRole("textbox", { name: "email" });
      expect(emailInput).toBeVisible();
      await emailInput.fill(userCredentials.email);

      const passwordInput = page.getByLabel("Password", { exact: true });
      expect(passwordInput).toBeVisible();
      await passwordInput.fill("password");

      const passwordConfirmInput = page.getByLabel("Confirm your password");
      expect(passwordConfirmInput).toBeVisible();
      await passwordConfirmInput.fill("password");

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const usernameError = page.getByText(
        "Password must contain at least a lowercase letter, a uppercase letter, a number and a special character ( ! @ # $ % )"
      );
      expect(usernameError).toBeVisible();
    });

    test("should show Passwords do not match when password does not match with password confirm", async ({
      page,
    }) => {
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
      await passwordConfirmInput.fill("password");

      const submitButton = page.getByRole("button", { name: "Sign Up" });
      expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(1000);

      const usernameError = page.getByText("Passwords do not match");
      expect(usernameError).toBeVisible();
    });
  });
});
