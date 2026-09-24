import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

async function openWorkbench(page: Page) {
  await page.goto("/tools/easing");
  await expect(page.getByTestId("easing-workbench")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
}

test("motion language docs render", async ({ page }) => {
  await page.goto("/docs/motion-language");
  await expect(page.getByRole("heading", { level: 1, name: "Motion language" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("easing workbench renders specimens and graph controls", async ({ page }) => {
  await openWorkbench(page);
  await expect(page.getByRole("heading", { level: 1, name: "Easing workbench" })).toBeVisible();
  await expect(page.getByTestId("easing-workbench")).toBeVisible();
  await expect(page.getByTestId("bezier-handle-p1")).toBeVisible();
  await expect(page.getByTestId("specimen-text")).toBeVisible();
  await expect(page.getByTestId("export-json")).toContainText("easing");
  await expectNoHorizontalOverflow(page);
});

test("easing workbench honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openWorkbench(page);
  await expect(page.getByTestId("easing-workbench")).toBeVisible();
  await expect(page.getByTestId("pop-control")).toBeVisible();
});

test("curve handles respond to the keyboard", async ({ page }) => {
  await openWorkbench(page);
  const handle = page.getByTestId("bezier-handle-p1");
  await handle.focus();
  const before = await handle.getAttribute("aria-valuetext");
  await handle.press("ArrowRight");
  await expect(handle).not.toHaveAttribute("aria-valuetext", before ?? "");
});

test("workbench restores a draft from localStorage", async ({ page }) => {
  await openWorkbench(page);
  await page.getByTestId("duration").fill("0.77");
  await expect
    .poll(async () =>
      page.evaluate(() => window.localStorage.getItem("cds.easing-workbench.v1")),
    )
    .toContain("0.77");
  await page.reload();
  await expect(page.getByTestId("easing-workbench")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  await expect(page.getByTestId("duration")).toHaveValue("0.77");
  await page.getByTestId("reset-house").click();
  await expect(page.getByTestId("duration")).toHaveValue("0.55");
});
