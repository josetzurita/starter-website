import { describe, expect, it } from "vitest";
import { GSAP_SCROLL_SCRUB_EASE } from "./gsap-ease-names";
import {
  resolveScrollSceneMode,
  SCROLL_BREAKPOINTS,
  scrollMatchMedia,
  shouldPinScrollScene,
} from "./scroll/scroll-breakpoints";
import {
  clampDisableBelow,
  clampOpacityTo,
  clampScaleTo,
  clampStackOffset,
  horizontalTravel,
  resolveScrub,
  SCROLL_SCENE_DEFAULTS,
  SCROLL_SCRUB_EASE,
} from "./scroll/scroll-options";

describe("scroll option validation", () => {
  it("clamps scale, opacity, and offset", () => {
    expect(clampScaleTo(0.2)).toBe(SCROLL_SCENE_DEFAULTS.scaleToMin);
    expect(clampScaleTo(0.92)).toBe(0.92);
    expect(clampScaleTo(1.4)).toBe(SCROLL_SCENE_DEFAULTS.scaleToMax);
    expect(clampOpacityTo(-1)).toBe(0);
    expect(clampOpacityTo(0.45)).toBe(0.45);
    expect(clampOpacityTo(2)).toBe(1);
    expect(clampStackOffset(-8)).toBe(0);
    expect(clampStackOffset(40)).toBe(40);
    expect(clampStackOffset(400)).toBe(SCROLL_SCENE_DEFAULTS.offsetMax);
  });

  it("validates scrub and disableBelow", () => {
    expect(resolveScrub(undefined)).toBe(true);
    expect(resolveScrub(true)).toBe(true);
    expect(resolveScrub(false)).toBe(false);
    expect(resolveScrub(0.5)).toBe(0.5);
    expect(resolveScrub(-2)).toBe(0);
    expect(resolveScrub(9)).toBe(SCROLL_SCENE_DEFAULTS.scrubLagMax);
    expect(resolveScrub(Number.NaN)).toBe(true);
    expect(clampDisableBelow(-10)).toBe(0);
    expect(clampDisableBelow(768)).toBe(768);
    expect(clampDisableBelow(99999)).toBe(SCROLL_SCENE_DEFAULTS.disableBelowMax);
  });

  it("uses none for scrubbed travel", () => {
    expect(SCROLL_SCRUB_EASE).toBe("none");
    expect(SCROLL_SCRUB_EASE).toBe(GSAP_SCROLL_SCRUB_EASE);
    expect(SCROLL_SCENE_DEFAULTS.ease).toBe("none");
  });
});

describe("horizontal distance", () => {
  it("calculates travel from real widths", () => {
    expect(horizontalTravel(1400, 800)).toBe(600);
    expect(horizontalTravel(400, 800)).toBe(0);
    expect(horizontalTravel(-20, 800)).toBe(0);
    expect(horizontalTravel(Number.NaN, 800)).toBe(0);
  });
});

describe("scroll breakpoint policy", () => {
  it("keeps the documented collapse breakpoint", () => {
    expect(SCROLL_BREAKPOINTS.collapseBelow).toBe(768);
  });

  it("covers desktop and mobile widths as named queries", () => {
    const queries = scrollMatchMedia(768);
    expect(queries.isDesktop).toBe("(min-width: 768px)");
    expect(queries.isMobile).toBe("(max-width: 767px)");
    expect(queries.reduceMotion).toBe("(prefers-reduced-motion: reduce)");
  });

  it("selects reduced-motion before pinning", () => {
    expect(
      resolveScrollSceneMode({
        reduce: true,
        viewportWidth: 1440,
        disableBelow: 768,
      }),
    ).toBe("reduced-motion");
    expect(shouldPinScrollScene("reduced-motion")).toBe(false);
  });

  it("selects mobile below the collapse width", () => {
    expect(
      resolveScrollSceneMode({
        reduce: false,
        viewportWidth: 390,
        disableBelow: 768,
      }),
    ).toBe("mobile");
    expect(shouldPinScrollScene("mobile")).toBe(false);
  });

  it("pins on wide viewports without reduced motion", () => {
    expect(
      resolveScrollSceneMode({
        reduce: false,
        viewportWidth: 1280,
        disableBelow: 768,
      }),
    ).toBe("pin");
    expect(shouldPinScrollScene("pin")).toBe(true);
  });

  it("never collapses when disableBelow is 0", () => {
    expect(
      resolveScrollSceneMode({
        reduce: false,
        viewportWidth: 320,
        disableBelow: 0,
      }),
    ).toBe("pin");
  });
});
