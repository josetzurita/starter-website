import { afterEach, describe, expect, it, vi } from "vitest";
import { getReducedMotionSnapshot, reducedMotionQuery } from "./reduced-motion";

describe("getReducedMotionSnapshot", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when matchMedia reports no preference", () => {
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
    });
    expect(getReducedMotionSnapshot()).toBe(false);
  });

  it("returns true when prefers-reduced-motion is reduce", () => {
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({
        matches: query === reducedMotionQuery,
      }),
    });
    expect(getReducedMotionSnapshot()).toBe(true);
  });
});
