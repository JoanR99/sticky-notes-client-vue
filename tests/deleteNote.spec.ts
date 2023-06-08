import { test, expect, chromium } from "@playwright/test";
import { getNotesFromParams, notes } from "./utils";

const baseURL = "http://localhost:5173";

test.describe("Delete note", () => {
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
    await page.route("**/api/notes**", async (route) => {
      if (route.request().method() == "GET") {
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
      }
    });

    await page.route("**/api/notes/**", async (route) => {
      expect(route.request().url().endsWith("1")).toBeTruthy();
      route.fulfill({
        body: JSON.stringify(notes[0]),
      });
    });

    await page.goto(baseURL);
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should show delete note dialog when delete icon is clicked in a note", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });
    expect(note).toBeVisible();

    const deleteIcon = note.locator('[aria-label="delete"]');
    expect(deleteIcon).toBeVisible();

    await deleteIcon.click();

    const dialogTitle = page.getByText(
      "Are you sure you want to delete this note?"
    );
    expect(dialogTitle).toBeVisible();
  });

  test("should call delete note endpoint when archive button is clicked", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });

    const deleteIcon = note.locator('[aria-label="delete"]');
    expect(deleteIcon).toBeVisible();

    await deleteIcon.click();

    const deleteButton = page.getByRole("button", {
      name: "Delete",
      exact: true,
    });

    expect(deleteButton).toBeVisible();

    await deleteButton.click();
  });
});
