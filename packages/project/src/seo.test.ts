import { describe, expect, it } from "vitest";
import {
  canonicalUrl,
  createMetadata,
  createRobots,
  createSitemap,
  jsonLdWebSite,
} from "./lib/seo";
import { defaultPointerAccentConfig, validateProjectConfig } from "./lib/project-config";

const config = validateProjectConfig({
  site: {
    name: "North Studio",
    shortName: "north-studio",
    description: "A client production site.",
    locale: "en",
    canonicalUrl: "https://north.example",
  },
  theme: { mode: "light", radius: "sm" },
  motion: { profile: "house", smoothScroll: false, pageTransition: "none" },
  features: { analytics: false, cms: false },
  pointerAccent: defaultPointerAccentConfig(),
});

describe("seo helpers", () => {
  it("builds canonical URLs from configuration", () => {
    expect(canonicalUrl(config)).toBe("https://north.example/");
    expect(canonicalUrl(config, "/work")).toBe("https://north.example/work");
  });

  it("creates metadata without invented company fields", () => {
    const metadata = createMetadata(config, { title: "Work", path: "/work" });
    expect(metadata.title).toBe("Work - North Studio");
    expect(metadata.description).toBe("A client production site.");
    expect(JSON.stringify(metadata)).not.toContain("Acme");
  });

  it("emits sitemap, robots, and JSON-LD from the same identity", () => {
    expect(createSitemap(config, ["/", "/work"])[1]?.url).toBe(
      "https://north.example/work",
    );
    expect(createRobots(config).host).toBe("https://north.example");
    expect(jsonLdWebSite(config).name).toBe("North Studio");
  });
});
