"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState, type RefObject } from "react";
import { registerGsap } from "../gsap";
import { useScopedGsap } from "../use-scoped-gsap";
import {
  resolveScrollSceneMode,
  SCROLL_BREAKPOINTS,
} from "./scroll-breakpoints";
import { clampDisableBelow } from "./scroll-options";
import {
  applyScrollDebugAttrs,
  debugMarkerConfig,
  killTriggersByPrefix,
} from "./scroll-debug";
import {
  observeScrollRefresh,
  refreshScrollLayout,
  waitForScrollAssets,
} from "./use-scroll-refresh";
import type { ScrollSceneContext, ScrollSceneMode } from "./scroll-types";

function readViewportWidth() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.innerWidth;
}

export function useScrollSceneMode(disableBelow: number): ScrollSceneMode {
  const reduce = useReducedMotion();
  const breakpoint = clampDisableBelow(disableBelow);
  const [viewportWidth, setViewportWidth] = useState<number | null>(readViewportWidth);

  useEffect(() => {
    const update = () => {
      setViewportWidth(window.innerWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return resolveScrollSceneMode({
    reduce,
    viewportWidth,
    disableBelow: breakpoint,
  });
}

export function useScrollScene({
  scope,
  dependencies = [],
  disableBelow = SCROLL_BREAKPOINTS.collapseBelow,
  debug = false,
  id,
  setup,
}: {
  scope: RefObject<HTMLElement | null>;
  dependencies?: unknown[];
  disableBelow?: number;
  debug?: boolean;
  id: string;
  setup: (ctx: ScrollSceneContext) => void | (() => void);
}) {
  const breakpoint = clampDisableBelow(disableBelow);
  const mode = useScrollSceneMode(breakpoint);

  useScopedGsap(() => {
    registerGsap();
    const root = scope.current;
    if (!root) {
      return;
    }

    const idPrefix = `cds-${id}`;
    killTriggersByPrefix(idPrefix);
    applyScrollDebugAttrs(root, debug);
    root.setAttribute("data-scroll-mode", mode);

    const ctx: ScrollSceneContext = {
      mode,
      root,
      markers: debugMarkerConfig(debug) && mode === "pin",
      idPrefix,
      refresh: refreshScrollLayout,
    };
    const userCleanup = setup(ctx);

    void waitForScrollAssets(root).then(() => {
      refreshScrollLayout();
    });

    const stopRefresh = observeScrollRefresh(root, () => {
      refreshScrollLayout();
    });

    return () => {
      userCleanup?.();
      stopRefresh();
      killTriggersByPrefix(idPrefix);
    };
  }, scope, [mode, breakpoint, debug, id, ...dependencies]);
}
