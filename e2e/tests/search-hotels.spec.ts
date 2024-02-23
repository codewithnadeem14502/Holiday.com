import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  //   await page.locator("[name=email]").fill("1@1.com");
  //   await page.locator("[name=password]").fill("password123");

  await page.locator("[name=email]").fill("1123@gmail.com");
  await page.locator("[name=password]").fill("11231123");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Login Successfully")).toBeVisible();
});
test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Test");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Test")).toBeVisible();
  await expect(page.getByText("Hotels found in Test  ")).toBeVisible();
});
