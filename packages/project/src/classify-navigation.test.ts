import { describe, expect, it } from "vitest";
import { classifyNavigation, shouldInterceptNavigation } from "./components/classify-navigation";

describe("navigation classification", () => {
  it("intercepts internal links", () => {
    const kind = classifyNavigation({
      href: "/work",
      currentPathname: "/",
    });
    expect(kind).toBe("internal");
    expect(shouldInterceptNavigation(kind)).toBe(true);
  });

  it("leaves hash links to the document", () => {
    expect(
      classifyNavigation({ href: "#after", currentPathname: "/work" }),
    ).toBe("hash");
    expect(
      classifyNavigation({ href: "/work#after", currentPathname: "/work" }),
    ).toBe("hash");
  });

  it("does not intercept external, blank, download, or modified clicks", () => {
    expect(
      classifyNavigation({
        href: "https://example.com",
        currentPathname: "/",
      }),
    ).toBe("external");
    expect(
      classifyNavigation({
        href: "/work",
        currentPathname: "/",
        target: "_blank",
      }),
    ).toBe("new-tab");
    expect(
      classifyNavigation({
        href: "/file.pdf",
        currentPathname: "/",
        download: true,
      }),
    ).toBe("download");
    expect(
      classifyNavigation({
        href: "/work",
        currentPathname: "/",
        metaKey: true,
      }),
    ).toBe("modified");
    expect(
      classifyNavigation({
        href: "/work",
        currentPathname: "/",
        ctrlKey: true,
      }),
    ).toBe("modified");
  });
});
