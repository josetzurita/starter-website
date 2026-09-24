import { describe, expect, it } from "vitest";
import {
  ProjectConfigError,
  createPresetProjectConfig,
  defaultPointerAccentConfig,
  registryItemsForPreset,
  validateProjectConfig,
} from "./lib/project-config";

const valid = {
  site: {
    name: "North Studio",
    shortName: "north-studio",
    description: "A client production site.",
    locale: "en",
    canonicalUrl: "https://north.example",
  },
  theme: { mode: "system" as const, radius: "md" as const },
  motion: {
    profile: "house" as const,
    smoothScroll: true,
    pageTransition: "overlay" as const,
  },
  features: { analytics: false, cms: false },
  pointerAccent: defaultPointerAccentConfig(),
};

describe("project configuration", () => {
  it("accepts a complete configuration", () => {
    expect(validateProjectConfig(valid).site.name).toBe("North Studio");
  });

  it("does not invent a missing canonical URL", () => {
    expect(() =>
      validateProjectConfig({
        ...valid,
        site: { ...valid.site, canonicalUrl: "" },
      }),
    ).toThrow(ProjectConfigError);
  });

  it("rejects non-https public URLs in production", () => {
    expect(() =>
      validateProjectConfig(
        {
          ...valid,
          site: { ...valid.site, canonicalUrl: "http://north.example" },
        },
        { production: true },
      ),
    ).toThrow(/https/);
  });

  it("rejects unknown theme modes instead of defaulting", () => {
    expect(() =>
      validateProjectConfig({
        ...valid,
        theme: { ...valid.theme, mode: "midnight" },
      }),
    ).toThrow(ProjectConfigError);
  });

  it("maps presets to registry items", () => {
    expect(registryItemsForPreset("minimal")).toEqual(["production-shell"]);
    expect(registryItemsForPreset("creative")).toEqual([
      "production-shell",
      "motion-foundations",
      "pointer-accent",
    ]);
    expect(registryItemsForPreset("storytelling")).toEqual([
      "production-shell",
      "motion-foundations",
      "pointer-accent",
      "scroll-storytelling",
    ]);
  });

  it("builds a preset config from the project name only", () => {
    const config = createPresetProjectConfig({
      name: "north-studio",
      title: "North Studio",
      preset: "creative",
      canonicalUrl: "http://127.0.0.1:3000",
    });
    expect(config.motion.smoothScroll).toBe(true);
    expect(config.features.analytics).toBe(false);
    expect(config.pointerAccent.enabled).toBe(false);
    expect(config.pointerAccent.blendMode).toBe("difference");
    expect(config.pointerAccent.ease).toBe("power3.out");
    expect(config.pointerAccent.size).toBe(14);
  });

  it("still accepts house tween intents as pointer ease", () => {
    const config = validateProjectConfig({
      ...valid,
      pointerAccent: { ...valid.pointerAccent, ease: "move" },
    });
    expect(config.pointerAccent.ease).toBe("move");
  });

  it("rejects a missing pointerAccent object instead of inventing one", () => {
    const { pointerAccent: _pointerAccent, ...rest } = valid;
    expect(() => validateProjectConfig(rest)).toThrow(ProjectConfigError);
  });
});
