import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createSite } from "./create-site/create-site";
import { parseCreateSiteArgs } from "./create-site/cli";
import { assertDestinationAvailable } from "./create-site/validate-destination";
import { titleFromName, validateProjectName } from "./create-site/validate-name";

describe("create-site validation", () => {
  it("accepts kebab-case names", () => {
    expect(validateProjectName("north-studio")).toBe("north-studio");
    expect(titleFromName("north-studio")).toBe("North Studio");
  });

  it("rejects invalid names", () => {
    expect(() => validateProjectName("North Studio")).toThrow();
    expect(() => validateProjectName("-leading")).toThrow();
  });

  it("never overwrites a non-empty destination", () => {
    const dest = mkdtempSync(path.join(os.tmpdir(), "cds-dest-"));
    writeFileSync(path.join(dest, "occupied.txt"), "no");
    expect(() => assertDestinationAvailable(dest)).toThrow(/non-empty/);
  });

  it("parses CLI arguments without string-concatenated shells", () => {
    const parsed = parseCreateSiteArgs([
      "north-studio",
      "--preset",
      "storytelling",
      "--skip-install",
    ]);
    expect(parsed.help).toBe(false);
    if (!parsed.help) {
      expect(parsed.preset).toBe("storytelling");
      expect(parsed.skipInstall).toBe(true);
    }
  });
});

describe("create-site generator", () => {
  const repoRoot = path.resolve(import.meta.dirname, "../../..");

  it.each(["minimal", "creative", "storytelling"] as const)(
    "copies the %s preset into a path that may contain spaces",
    (preset) => {
      const parent = mkdtempSync(path.join(os.tmpdir(), "cds site parent "));
      const dest = path.join(parent, `site ${preset}`);
      const result = createSite({
        name: `demo-${preset}`,
        preset,
        dest,
        skipInstall: true,
        repoRoot,
      });
      expect(result.dest).toBe(dest);
      expect(result.registryItems[0]).toBe("production-shell");
      if (preset === "minimal") {
        expect(result.registryItems).not.toContain("pointer-accent");
      } else {
        expect(result.registryItems).toContain("pointer-accent");
      }
      if (preset === "storytelling") {
        expect(result.registryItems).toContain("scroll-storytelling");
      }
      expect(existsSync(path.join(dest, "app", "styleguide", "page.tsx"))).toBe(true);
      expect(readFileSync(path.join(dest, ".env.example"), "utf8")).toContain(
        "ENABLE_STYLEGUIDE=false",
      );
    },
  );

  it("refuses to generate into an occupied folder", () => {
    const dest = mkdtempSync(path.join(os.tmpdir(), "cds-occupied-"));
    mkdirSync(path.join(dest, "keep"));
    expect(() =>
      createSite({
        name: "occupied-site",
        preset: "minimal",
        dest,
        skipInstall: true,
        repoRoot,
      }),
    ).toThrow(/non-empty/);
  });
});
