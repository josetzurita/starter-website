import { expect, test } from "@playwright/test";

test("reveal docs render and dialog opens", async ({ page }) => {
  await page.goto("/docs/reveal");
  await expect(page.getByRole("heading", { level: 1, name: "Reveal" })).toBeVisible();
  await expect(page.getByTestId("reveal-live")).toBeVisible();
  await page.getByRole("button", { name: "Open specimen dialog" }).click();
  await expect(page.getByTestId("dialog-reveal")).toBeVisible();
});

test("reveal docs honor reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/reveal");
  await expect(page.getByRole("heading", { level: 1, name: "Reveal" })).toBeVisible();
  await expect(page.getByTestId("reveal-live")).toBeVisible();
});
