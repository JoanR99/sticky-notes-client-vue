import { test, expect, chromium } from "@playwright/test";
import { getNotesFromParams, notes } from "./utils";
import { CreateNoteInput } from "../src/schemas/noteSchemas";

const newNote: CreateNoteInput = {
  title: "newTitle",
  content: "newContent",
  color: "blue",
};

const baseURL = "http://localhost:5173";

test.describe("Create note", () => {
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
      } else if (route.request().method() == "POST") {
        const data = route.request().postDataJSON();
        expect(data).toEqual({
          title: newNote.title,
          content: newNote.content,
          color: newNote.color,
        });

        route.fulfill({
          body: JSON.stringify(notes[0]),
        });
      }
    });

    await page.goto(baseURL);
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should show create note modal when add icon is clicked", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });
    expect(note).toBeVisible();

    const createNoteIcon = page.locator('[aria-label="add"]');
    expect(createNoteIcon).toBeVisible();

    await createNoteIcon.click();

    const titleInput = page.getByPlaceholder("Title");
    expect(titleInput).toBeVisible();
  });

  test("should call create note endpoint with correct input when add button is clicked", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });
    expect(note).toBeVisible();

    const createNoteIcon = page.locator('[aria-label="add"]');
    expect(createNoteIcon).toBeVisible();

    await createNoteIcon.click();

    const titleInput = page.getByPlaceholder("Title");
    await titleInput.fill(newNote.title);

    const contentInput = page.getByPlaceholder("Content");
    await contentInput.fill(newNote.content);

    const colorInput = page.locator(`[for="${newNote.color}"]`);
    expect(colorInput).toBeVisible();
    await colorInput.click();

    const addButton = page.getByRole("button", { name: "Add", exact: true });
    expect(addButton).toBeVisible();

    await addButton.click();
  });
});
