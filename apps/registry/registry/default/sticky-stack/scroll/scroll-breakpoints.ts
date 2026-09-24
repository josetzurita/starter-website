import { shouldAnimateMotion } from "../motion-policy";
import { clampDisableBelow, SCROLL_SCENE_DEFAULTS } from "./scroll-options";
import type { ScrollSceneMode } from "./scroll-types";

export const SCROLL_BREAKPOINTS = {
  collapseBelow: SCROLL_SCENE_DEFAULTS.disableBelow,
} as const;

export function scrollMatchMedia(disableBelow: number) {
  const breakpoint = clampDisableBelow(disableBelow);
  const mobileMax = Math.max(0, breakpoint - 1);
  return {
    isDesktop: `(min-width: ${String(breakpoint)}px)`,
    isMobile: `(max-width: ${String(mobileMax)}px)`,
    reduceMotion: "(prefers-reduced-motion: reduce)",
  };
}

export function resolveScrollSceneMode(options: {
  reduce: boolean | null | undefined;
  viewportWidth: number | null;
  disableBelow?: number;
}): ScrollSceneMode {
  if (!shouldAnimateMotion(options.reduce)) {
    return "reduced-motion";
  }
  const breakpoint = clampDisableBelow(
    options.disableBelow ?? SCROLL_BREAKPOINTS.collapseBelow,
  );
  if (
    breakpoint > 0 &&
    options.viewportWidth != null &&
    options.viewportWidth < breakpoint
  ) {
    return "mobile";
  }
  return "pin";
}

export function shouldPinScrollScene(mode: ScrollSceneMode): boolean {
  return mode === "pin";
}
