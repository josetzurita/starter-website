import { describe, expect, it } from "vitest";
import {
  POINTER_ACCENT_DEFAULTS,
  clampPointerSpeed,
  pointerAccentHoverTransform,
  pointerAccentLayoutSize,
  pointerDeformation,
  pointerHoverCoverScale,
  pointerRotationDeg,
  pointerSpeedPxPerMs,
  resolvePointerAccentOptions,
  resolvePointerEase,
} from "./pointer-accent-options";
import { shouldEnablePointerAccent } from "./motion-policy";
import { GSAP_EASE_NAMES } from "./gsap-ease-names";

describe("pointer accent math", () => {
  it("derives speed from distance and elapsed time", () => {
    expect(pointerSpeedPxPerMs(20, 10)).toBe(2);
    expect(pointerSpeedPxPerMs(20, 0)).toBe(0);
  });

  it("clamps speed and maximum deformation", () => {
    expect(clampPointerSpeed(99)).toBe(POINTER_ACCENT_DEFAULTS.speedMax);
    const rest = pointerDeformation(0, 0.5, 0.8);
    expect(rest.scaleX).toBe(1);
    expect(rest.scaleY).toBe(1);
    const maxed = pointerDeformation(99, 2, 0.5);
    expect(maxed.scaleX).toBe(1.5);
    expect(maxed.scaleY).toBeCloseTo(1 / 1.5);
  });

  it("rotates toward movement direction", () => {
    expect(pointerRotationDeg(1, 0)).toBe(0);
    expect(pointerRotationDeg(0, 1)).toBe(90);
  });

  it("maps settle ease through the motion profile name", () => {
    expect(resolvePointerEase("settle")).toBe(GSAP_EASE_NAMES.settle);
    expect(resolvePointerEase("power2.out")).toBe("power2.out");
    expect(resolvePointerEase(undefined)).toBe("power3.out");
  });

  it("defaults to the Lab kinetic language", () => {
    const resolved = resolvePointerAccentOptions();
    expect(resolved.enabled).toBe(false);
    expect(resolved.size).toBe(14);
    expect(resolved.color).toBe("oklch(0.97 0.004 250)");
    expect(resolved.opacity).toBe(1);
    expect(resolved.lag).toBe(0.4);
    expect(resolved.ease).toBe("power3.out");
    expect(resolved.stretch).toBe(0.2);
    expect(resolved.maxStretch).toBe(0.6);
    expect(resolved.blendMode).toBe("difference");
    expect(resolved.hoverGrow).toBe(true);
  });

  it("keeps client visual options without inventing a palette", () => {
    const resolved = resolvePointerAccentOptions({
      enabled: true,
      color: "var(--foreground)",
      size: 400,
      lag: 0,
    });
    expect(resolved.color).toBe("var(--foreground)");
    expect(resolved.size).toBe(POINTER_ACCENT_DEFAULTS.sizeMax);
    expect(resolved.lag).toBe(POINTER_ACCENT_DEFAULTS.lagMin);
  });

  it("covers a target with transform scale, not width or height", () => {
    const scale = pointerHoverCoverScale(36, 180, 40, 12);
    expect(scale).toBeGreaterThan(1);
    expect(scale).toBeLessThanOrEqual(12);
    expect(scale).toBe((180 * POINTER_ACCENT_DEFAULTS.hoverPadding) / 36);
    expect(POINTER_ACCENT_DEFAULTS.hoverScaleMax).toBe(1.5);
    expect(pointerHoverCoverScale(36, 400, 400, POINTER_ACCENT_DEFAULTS.hoverScaleMax)).toBe(1.5);
    expect(pointerAccentLayoutSize(36, true, 2)).toBe(72);
    expect(pointerAccentHoverTransform(1, true, 2)).toBe(0.5);
    expect(pointerAccentHoverTransform(2, true, 2)).toBe(1);
  });

  it("resolves hover selectors without attaching to every paragraph", () => {
    const resolved = resolvePointerAccentOptions({ hoverGrow: true });
    expect(resolved.hoverGrow).toBe(true);
    expect(resolved.textSelectors).toBe("[data-pointer-accent-text]");
    expect(resolved.hoverSelectors).toContain("a, button");
  });
});

describe("pointer accent policy", () => {
  it("requires an explicit enable flag", () => {
    expect(
      shouldEnablePointerAccent({
        enabled: false,
        reduce: false,
        finePointer: true,
        pointerType: "mouse",
      }),
    ).toBe(false);
  });

  it("disables on reduced motion, touch, and coarse pointers", () => {
    expect(
      shouldEnablePointerAccent({
        enabled: true,
        reduce: true,
        finePointer: true,
        pointerType: "mouse",
      }),
    ).toBe(false);
    expect(
      shouldEnablePointerAccent({
        enabled: true,
        reduce: false,
        finePointer: false,
        pointerType: "mouse",
      }),
    ).toBe(false);
    expect(
      shouldEnablePointerAccent({
        enabled: true,
        reduce: false,
        finePointer: true,
        pointerType: "touch",
      }),
    ).toBe(false);
  });
});
