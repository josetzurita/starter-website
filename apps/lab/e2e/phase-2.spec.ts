import { expect, test } from "@playwright/test";
import { expectDocs } from "./helpers";

const pages = [
  { path: "/docs/stagger", title: "Stagger", testId: "stagger-live" },
  { path: "/docs/text-reveal", title: "TextReveal", testId: "text-reveal-live" },
  { path: "/docs/parallax", title: "Parallax", testId: "parallax-live" },
  { path: "/docs/magnetic", title: "Magnetic", testId: "magnetic-live" },
  { path: "/docs/scroll-progress", title: "ScrollProgress", testId: "scroll-progress-live" },
  { path: "/docs/image-reveal", title: "ImageReveal", testId: "image-reveal-live" },
];

for (const entry of pages) {
  test(`${entry.title} docs render`, async ({ page }) => {
    await page.goto(entry.path);
    await expectDocs(page, entry.title, entry.testId);
  });

  test(`${entry.title} docs honor reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(entry.path);
    await expectDocs(page, entry.title, entry.testId);
  });
}

test("TextReveal exposes one accessible text string", async ({ page }) => {
  await page.goto("/docs/text-reveal");
  const live = page.getByTestId("text-reveal-live");
  const sample =
    "One accessible string. Fragments stay hidden from assistive technology.";
  await expect(live.locator("[data-text-reveal-text]")).toHaveCount(1);
  await expect(live.locator("[data-text-reveal-text]")).toHaveText(sample);
  await expect(live.locator("[data-text-reveal-visual]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(live.getByRole("paragraph")).toHaveCount(1);
});

test("Magnetic preserves click and keyboard", async ({ page }, testInfo) => {
  await page.goto("/docs/magnetic");
  const button = page.getByTestId("magnetic-button");
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.getByTestId("magnetic-count")).toHaveText("Activations 1");

  if (testInfo.project.name === "mobile") {
    return;
  }

  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("magnetic-count")).toHaveText("Activations 2");
});
