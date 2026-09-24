import { clamp } from "../clamp";
import type { ScrollScrub } from "./scroll-types";

export const SCROLL_SCRUB_EASE = "none" as const;

export const SCROLL_SCENE_DEFAULTS = {
  scaleTo: 0.92,
  scaleToMin: 0.5,
  scaleToMax: 1,
  opacityTo: 0.45,
  opacityToMin: 0,
  opacityToMax: 1,
  offset: 0,
  offsetMin: 0,
  offsetMax: 120,
  scrub: true as ScrollScrub,
  scrubLagMax: 2,
  disableBelow: 768,
  disableBelowMin: 0,
  disableBelowMax: 4096,
  ease: SCROLL_SCRUB_EASE,
};

export function clampScaleTo(value: number): number {
  return clamp(
    value,
    SCROLL_SCENE_DEFAULTS.scaleToMin,
    SCROLL_SCENE_DEFAULTS.scaleToMax,
  );
}

export function clampOpacityTo(value: number): number {
  return clamp(
    value,
    SCROLL_SCENE_DEFAULTS.opacityToMin,
    SCROLL_SCENE_DEFAULTS.opacityToMax,
  );
}

export function clampStackOffset(value: number): number {
  return clamp(
    value,
    SCROLL_SCENE_DEFAULTS.offsetMin,
    SCROLL_SCENE_DEFAULTS.offsetMax,
  );
}

export function clampDisableBelow(value: number): number {
  return clamp(
    Math.round(value),
    SCROLL_SCENE_DEFAULTS.disableBelowMin,
    SCROLL_SCENE_DEFAULTS.disableBelowMax,
  );
}

export function resolveScrub(value: ScrollScrub | undefined): ScrollScrub {
  if (value == null) {
    return SCROLL_SCENE_DEFAULTS.scrub;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (!Number.isFinite(value)) {
    return SCROLL_SCENE_DEFAULTS.scrub;
  }
  return clamp(value, 0, SCROLL_SCENE_DEFAULTS.scrubLagMax);
}

export function horizontalTravel(
  trackWidth: number,
  viewportWidth: number,
): number {
  const track = Number.isFinite(trackWidth) ? Math.max(0, trackWidth) : 0;
  const viewport = Number.isFinite(viewportWidth)
    ? Math.max(0, viewportWidth)
    : 0;
  return Math.max(0, track - viewport);
}
