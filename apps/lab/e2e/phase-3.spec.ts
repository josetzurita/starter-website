import { expect, test, type Page } from "@playwright/test";
import { expectDocs, expectNoHorizontalOverflow } from "./helpers";

async function triggerCount(page: Page) {
  const text = await page.getByTestId("scroll-trigger-count").textContent();
  const match = text?.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

async function globalTriggerCount(page: Page) {
  const text = await page.getByTestId("global-scroll-trigger-count").textContent();
  return Number(text ?? 0);
}

test("sticky stack docs render", async ({ page }) => {
  await page.goto("/docs/sticky-stack");
  await expectDocs(page, "StickyStack", "sticky-stack-live");
});

test("horizontal gallery docs render", async ({ page }) => {
  await page.goto("/docs/horizontal-gallery");
  await expectDocs(page, "HorizontalGallery", "horizontal-gallery-live");
});

test("pinned story docs render", async ({ page }) => {
  await page.goto("/docs/pinned-story");
  await expectDocs(page, "PinnedStory", "pinned-story-live");
});

test("sticky stack pins then releases", async ({ page }, testInfo) => {
  await page.goto("/docs/sticky-stack");
  await expect(page.locator("[data-sticky-stack]")).toBeVisible();

  if (testInfo.project.name === "mobile") {
    await expect
      .poll(async () => page.locator("[data-sticky-stack]").getAttribute("data-scroll-mode"))
      .toBe("mobile");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    return;
  }

  await expect
    .poll(async () => triggerCount(page))
    .toBeGreaterThan(0);
  expect(await triggerCount(page)).toBeLessThan(12);

  const first = page.locator("[data-sticky-stack-item]").first();
  await first.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 120));
  await expect.poll(async () => page.locator(".pin-spacer").count()).toBeGreaterThan(0);

  await page.getByTestId("sticky-stack-after").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("sticky-stack-after")).toBeInViewport({ timeout: 4000 });
});

test("horizontal gallery measures travel and avoids document overflow", async ({
  page,
}, testInfo) => {
  await page.goto("/docs/horizontal-gallery");
  await expectNoHorizontalOverflow(page);
  await expect(page.getByTestId("scroll-scene-extra")).toContainText(/mode/);

  if (testInfo.project.name === "mobile") {
    await expect
      .poll(async () =>
        page.locator("[data-horizontal-gallery]").getAttribute("data-scroll-mode"),
      )
      .toBe("mobile");
    const gallery = page.locator("[data-horizontal-gallery]");
    await gallery.evaluate((node) => {
      node.scrollLeft = 80;
    });
    await expect.poll(async () => gallery.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
    return;
  }

  await expect
    .poll(async () => page.locator("[data-horizontal-gallery]").getAttribute("data-scroll-mode"))
    .toBe("pin");
  await expect
    .poll(async () => page.locator("[data-horizontal-gallery]").getAttribute("data-horizontal-travel"))
    .toMatch(/^[1-9]/);
  await expect(page.getByTestId("gallery-media")).toBeVisible();
  await expect.poll(async () => triggerCount(page)).toBeGreaterThan(0);

  const gallery = page.locator("[data-horizontal-gallery]");
  await gallery.evaluate((node) => {
    node.scrollIntoView({ block: "start" });
  });
  await page.evaluate(() => window.scrollBy(0, 80));
  await expect.poll(async () => page.locator(".pin-spacer").count()).toBeGreaterThan(0);

  const beforeTransform = await page
    .locator("[data-horizontal-gallery-track]")
    .evaluate((node) => getComputedStyle(node).transform);
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect
    .poll(async () =>
      page
        .locator("[data-horizontal-gallery-track]")
        .evaluate((node) => getComputedStyle(node).transform),
    )
    .not.toBe(beforeTransform);

  const before =
    (await page.locator("[data-horizontal-gallery]").getAttribute("data-horizontal-travel")) ??
    "0";
  await page.setViewportSize({ width: 900, height: 800 });
  await expect
    .poll(async () => page.locator("[data-horizontal-gallery]").getAttribute("data-horizontal-travel"))
    .not.toBe(before);
  await expectNoHorizontalOverflow(page);

  await page.getByTestId("horizontal-gallery-after").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("horizontal-gallery-after")).toBeInViewport({ timeout: 4000 });
});

test("pinned story exposes a discrete index and releases", async ({ page }, testInfo) => {
  await page.goto("/docs/pinned-story");
  await expect(page.locator("[data-pinned-story]")).toBeVisible();

  if (testInfo.project.name === "mobile") {
    await expect
      .poll(async () => page.locator("[data-pinned-story]").getAttribute("data-scroll-mode"))
      .toBe("mobile");
    await expect(page.locator("[data-pinned-story-visual]")).toHaveCount(4);
    return;
  }

  await expect.poll(async () => triggerCount(page)).toBeGreaterThan(1);
  await page.getByTestId("pinned-story-after").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("pinned-story-after")).toBeInViewport({ timeout: 4000 });
});

test("reduced motion disables pinning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/sticky-stack");
  await expect
      .poll(async () => page.locator("[data-sticky-stack]").getAttribute("data-scroll-mode"))
    .toBe("reduced-motion");
  await expect.poll(async () => triggerCount(page)).toBe(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);

  await page.goto("/docs/horizontal-gallery");
  await expect
    .poll(async () =>
      page.locator("[data-horizontal-gallery]").getAttribute("data-scroll-mode"),
    )
    .toBe("reduced-motion");
  await expect.poll(async () => triggerCount(page)).toBe(0);

  await page.goto("/docs/pinned-story");
  await expect
      .poll(async () => page.locator("[data-pinned-story]").getAttribute("data-scroll-mode"))
    .toBe("reduced-motion");
  await expect(page.locator("[data-pinned-story-visual]")).toHaveCount(4);
});

test("route cleanup returns ScrollTrigger count to baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Pinning is desktop-only");
  await page.goto("/docs/sticky-stack");
  await expect.poll(async () => triggerCount(page)).toBeGreaterThan(0);
  await page.goto("/");
  await expect.poll(async () => globalTriggerCount(page)).toBe(0);
});

test("debug markers toggle", async ({ page }) => {
  await page.goto("/docs/sticky-stack");
  await page.getByTestId("scroll-debug-toggle").check();
  await expect(page.locator("[data-sticky-stack]")).toHaveAttribute(
    "data-cds-scroll-debug",
    "true",
  );
  await expect(page.getByTestId("scroll-debug-hint")).toBeVisible();
});

test("anchor navigation reaches the release section", async ({ page }) => {
  await page.goto("/docs/sticky-stack");
  await page.getByRole("link", { name: "After the stack" }).click();
  await expect(page.locator("#sticky-stack-after")).toBeInViewport({ timeout: 4000 });
});

test("keyboard scrolling still moves the document", async ({ page }) => {
  await page.goto("/docs/sticky-stack");
  await page.locator("body").click();
  const before = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("PageDown");
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => window.scrollY);
  expect(after).toBeGreaterThan(before);
  await page.getByRole("button", { name: "Keyboard target 1" }).focus();
  await expect(page.getByRole("button", { name: "Keyboard target 1" })).toBeFocused();
});

test("Lenis stays a single synced instance while pins run", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Lenis is desktop-only");
  await page.goto("/docs/sticky-stack");
  await expect(page.locator("html")).toHaveAttribute("data-smooth-scroll-mode", "smooth");
  await expect
    .poll(async () => page.getByTestId("global-scroll-trigger-count").getAttribute("data-lenis-sync"))
    .toBe("1");
  await page.evaluate(() => window.scrollBy(0, 240));
  await expect.poll(async () => triggerCount(page)).toBeGreaterThan(0);
});
