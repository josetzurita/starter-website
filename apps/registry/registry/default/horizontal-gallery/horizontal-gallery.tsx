"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap } from "./gsap";
import { SCROLL_BREAKPOINTS } from "./scroll/scroll-breakpoints";
import {
  clampDisableBelow,
  horizontalTravel,
  resolveScrub,
  SCROLL_SCENE_DEFAULTS,
} from "./scroll/scroll-options";
import { useScrollScene, useScrollSceneMode } from "./scroll/use-scroll-scene";
import type { ScrollScrub } from "./scroll/scroll-types";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Pin the wrapper and translate the track from measured widths.
 * Mobile uses native overflow swipe. Reduced motion does not pin.
 */
export type HorizontalGalleryProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** ScrollTrigger scrub. `true` or lag in seconds 0-2. Default true. */
  scrub?: ScrollScrub;
  /** Collapse below this width. Default 768. */
  disableBelow?: number;
  /** Development markers and debug attributes. Default false. */
  debug?: boolean;
};

export type HorizontalGalleryItemProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function HorizontalGallery({
  children,
  className,
  trackClassName,
  scrub = SCROLL_SCENE_DEFAULTS.scrub,
  disableBelow = SCROLL_BREAKPOINTS.collapseBelow,
  debug = false,
}: HorizontalGalleryProps) {
  const scope = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const resolvedScrub = resolveScrub(scrub);
  const resolvedBreakpoint = clampDisableBelow(disableBelow);
  const mode = useScrollSceneMode(resolvedBreakpoint);

  useScrollScene({
    scope,
    id: "horizontal-gallery",
    debug,
    disableBelow: resolvedBreakpoint,
    dependencies: [resolvedScrub],
    setup: ({ mode: sceneMode, markers, idPrefix, root }) => {
      const wrapper = root;
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const writeTravel = () => {
        const travel = horizontalTravel(track.scrollWidth, wrapper.clientWidth);
        wrapper.setAttribute("data-horizontal-travel", String(travel));
        return travel;
      };

      writeTravel();

      if (sceneMode !== "pin") {
        gsap.set(track, { x: 0, clearProps: "transform" });
        return;
      }

      gsap.to(track, {
        x: () => -writeTravel(),
        ease: SCROLL_SCENE_DEFAULTS.ease,
        scrollTrigger: {
          id: `${idPrefix}-track`,
          trigger: wrapper,
          pin: true,
          scrub: resolvedScrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          start: "top top",
          end: () => `+=${String(writeTravel())}`,
          markers,
        },
      });
    },
  });

  return (
    <div
      ref={scope}
      className={cn(
        "relative w-full max-w-full",
        mode === "pin" && "overflow-hidden",
        mode === "mobile" && "overflow-x-auto overflow-y-hidden",
        mode === "reduced-motion" && "overflow-visible",
        className,
      )}
      data-horizontal-gallery=""
      data-scroll-mode={mode}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-max",
          mode === "reduced-motion" && "w-full flex-col",
          trackClassName,
        )}
        data-horizontal-gallery-track=""
      >
        {children}
      </div>
    </div>
  );
}

export function HorizontalGalleryItem({
  children,
  className,
  ...props
}: HorizontalGalleryItemProps) {
  return (
    <div
      {...props}
      className={cn("shrink-0", className)}
      data-horizontal-gallery-item=""
    >
      {children}
    </div>
  );
}
