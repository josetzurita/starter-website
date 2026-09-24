import { expect, test } from "@playwright/test";
import { expectDocs, expectNoHorizontalOverflow } from "./helpers";

test("project config docs render", async ({ page }) => {
  await page.goto("/docs/project-config");
  await expectDocs(page, "ProjectConfig", "project-config-live");
});

test("project providers docs render", async ({ page }) => {
  await page.goto("/docs/project-providers");
  await expectDocs(page, "ProjectProviders", "project-providers-live");
});

test("site navigation is keyboardable and has current-page semantics", async ({
  page,
}, testInfo) => {
  await page.goto("/docs/site-navigation");
  const live = page.getByTestId("site-navigation-live");
  await expect(live).toBeVisible();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    const dialog = page.getByRole("dialog", { name: "Navigation" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Navigation" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  } else {
    await expect(
      live.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Navigation" }),
    ).toHaveAttribute("aria-current", "page");
  }
});

test("responsive media keeps intrinsic layout", async ({ page }) => {
  await page.goto("/docs/responsive-media");
  await expectDocs(page, "Responsive media", "responsive-media-live");
  const ratio = await page.getByTestId("aspect-media").evaluate((node) => {
    const styles = getComputedStyle(node);
    return styles.aspectRatio;
  });
  expect(ratio).toContain("16");
  await expectNoHorizontalOverflow(page);
});

test("route transition links classify internal and external behavior", async ({
  page,
}) => {
  await page.goto("/docs/route-transitions");
  await expect(page.getByTestId("route-transitions-live")).toBeVisible();
  await expect(page.getByRole("link", { name: "External" })).toHaveAttribute(
    "href",
    "https://example.com",
  );
  await page.getByRole("link", { name: "Hash" }).click();
  await expect(page.locator("#recovery")).toBeInViewport();
});

test("overlay recovers when navigation never completes", async ({ page }) => {
  await page.goto("/docs/route-transitions");
  await page.getByTestId("recover-timeout").click();
  await expect(page.getByTestId("lab-route-overlay")).toHaveAttribute(
    "data-phase",
    "covering",
  );
  await expect(page.getByTestId("lab-route-overlay")).toHaveAttribute(
    "data-phase",
    "idle",
    { timeout: 4000 },
  );
});

test("reduced motion skips overlay navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/route-transitions");
  await page.getByRole("link", { name: "Internal" }).click();
  await expect(page).toHaveURL(/project-config/);
});

test("project builder stays lab-only", async ({ page }) => {
  await page.goto("/tools/project-builder");
  await expect(page.getByTestId("project-builder-live")).toBeVisible();
  await expect(page.getByTestId("project-builder-command")).toContainText(
    "pnpm create:site",
  );
});

test("pointer accent docs and styleguide keep the native cursor", async ({
  page,
}, testInfo) => {
  await page.goto("/docs/pointer-accent");
  await expectDocs(page, "PointerAccent", "pointer-accent-live");
  await page.mouse.move(120, 160);

  if (testInfo.project.name === "mobile") {
    await expect(page.getByTestId("pointer-accent")).toHaveCount(0);
    return;
  }

  const accent = page.getByTestId("pointer-accent");
  await expect(accent).toHaveCount(1);
  await expect(accent).toHaveCSS("pointer-events", "none");
  const cursors = await page.evaluate(() => {
    const node = document.querySelector("[data-pointer-accent]");
    return {
      node: node ? getComputedStyle(node).cursor : "missing",
      body: getComputedStyle(document.body).cursor,
      html: getComputedStyle(document.documentElement).cursor,
    };
  });
  expect(cursors.node).not.toBe("none");
  expect(cursors.body).not.toBe("none");
  expect(cursors.html).not.toBe("none");

  await page.goto("/styleguide");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("pointer-accent-styleguide")).toBeVisible();
});

test("pointer accent is absent under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/pointer-accent");
  await expect(page.getByTestId("pointer-accent-live")).toBeVisible();
  await page.mouse.move(80, 120);
  await expect(page.getByTestId("pointer-accent")).toHaveCount(0);
});
