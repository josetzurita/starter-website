import { expect, test } from "@playwright/test";
import { expectDocs, expectNoHorizontalOverflow } from "./helpers";

test("smooth scroll docs render", async ({ page }) => {
  await page.goto("/docs/smooth-scroll");
  await expectDocs(page, "SmoothScroll", "smooth-scroll-live");
  await expect(page.getByTestId("smooth-scroll-mode")).toBeVisible();
});

test("smooth scroll docs honor reduced motion as native", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/smooth-scroll");
  await expect(page.getByTestId("smooth-scroll-mode")).toHaveText(
    /Active mode: reduced-motion/,
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-smooth-scroll-mode",
    "reduced-motion",
  );
  await expectNoHorizontalOverflow(page);
});

test("smooth scroll reports touch or smooth by project", async ({
  page,
}, testInfo) => {
  await page.goto("/docs/smooth-scroll");
  const expected =
    testInfo.project.name === "mobile" ? "native-touch" : "smooth";
  await expect(page.locator("html")).toHaveAttribute(
    "data-smooth-scroll-mode",
    expected,
  );
});

test("keyboard scrolling moves the document", async ({ page }) => {
  await page.goto("/docs/smooth-scroll");
  await page.locator("body").click();
  const before = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("PageDown");
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => window.scrollY);
  expect(after).toBeGreaterThan(before);
});

test("anchor navigation reaches the nested region", async ({ page }) => {
  await page.goto("/docs/smooth-scroll");
  await page.getByRole("link", { name: "Nested region" }).click();
  await expect(page.locator("#nested-scroll")).toBeInViewport({ timeout: 4000 });
});

test("nested region can scroll independently", async ({ page }) => {
  await page.goto("/docs/smooth-scroll");
  await page.getByRole("link", { name: "Nested region" }).click();
  const nested = page.getByTestId("smooth-scroll-nested");
  await expect(nested).toBeVisible();
  await nested.evaluate((node) => {
    node.scrollTop = 80;
  });
  await expect
    .poll(async () => nested.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0);
});

test("dialog overflowing content can scroll", async ({ page }) => {
  await page.goto("/docs/smooth-scroll");
  await page.getByRole("button", { name: "Open overflowing dialog" }).click();
  const panel = page.getByTestId("smooth-scroll-dialog");
  await expect(panel).toBeVisible();
  await panel.evaluate((node) => {
    const scroller = node.closest("[data-lenis-prevent]");
    if (scroller) {
      scroller.scrollTop = 60;
    }
  });
  await expect
    .poll(async () =>
      panel.evaluate((node) => node.closest("[data-lenis-prevent]")?.scrollTop ?? 0),
    )
    .toBeGreaterThan(0);
});
