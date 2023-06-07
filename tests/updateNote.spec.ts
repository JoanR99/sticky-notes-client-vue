import { test, expect, chromium } from "@playwright/test";
import { getNotesFromParams, notes } from "./utils";
import { Note } from "../src/schemas/noteSchemas";

const baseURL = "http://localhost:5173";

test.describe("Update note", () => {
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
      const data: Partial<Note> = route.request().postDataJSON();
      if ("isArchive" in data) {
        expect(data).toEqual({
          isArchive: !notes[0].isArchive,
        });

        route.fulfill({
          body: JSON.stringify({
            ...notes[0],
            isArchive: !notes[0].isArchive,
          }),
        });
      } else {
        expect(data).toEqual({
          title: "new title",
          content: "new content",
          color: notes[0].color,
        });

        route.fulfill({
          body: JSON.stringify({
            ...notes[0],
            title: "new title",
            content: "new content",
          }),
        });
      }
    });

    await page.goto(baseURL);
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("should show archive note dialog when archive icon is clicked in a note", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });
    expect(note).toBeVisible();

    const archiveIcon = note.locator('[aria-label="archive"]');
    expect(archiveIcon).toBeVisible();

    await archiveIcon.click();

    const dialogTitle = page.getByText(
      "Are you sure you want to archive this note?"
    );
    expect(dialogTitle).toBeVisible();
  });

  test("should call update note endpoint when archive button is clicked", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });

    const archiveIcon = note.locator('[aria-label="archive"]');

    await archiveIcon.click();

    const archiveButton = page.getByRole("button", {
      name: "Archive",
      exact: true,
    });

    expect(archiveButton).toBeVisible();

    await archiveButton.click();
  });

  test("should show update note modal when update icon is clicked in a note", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });
    expect(note).toBeVisible();

    const editIcon = note.locator('[aria-label="edit"]');
    expect(editIcon).toBeVisible();

    await editIcon.click();

    await page.waitForSelector("input[name='title']");

    const titleInput = page.getByPlaceholder("Title");
    expect(titleInput).toBeVisible();
  });

  test("should call update note endpoint with correct input when edit button is clicked", async ({
    page,
  }) => {
    await page.waitForSelector("article");

    const note = page.locator("article").filter({ hasText: /title/ });
    expect(note).toBeVisible();

    const editIcon = note.locator('[aria-label="edit"]');
    expect(editIcon).toBeVisible();

    await editIcon.click();

    await page.waitForSelector("input[name='title']");

    const titleInput = page.getByPlaceholder("Title");
    await titleInput.fill("new title");

    const contentInput = page.getByPlaceholder("Content");
    await contentInput.fill("new content");

    const updateButton = page.getByRole("button", { name: "Edit" });
    expect(updateButton).toBeVisible();

    await updateButton.click();
  });
});
