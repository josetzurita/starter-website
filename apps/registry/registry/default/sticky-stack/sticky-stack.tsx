"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { SCROLL_BREAKPOINTS } from "./scroll/scroll-breakpoints";
import {
  clampDisableBelow,
  clampOpacityTo,
  clampScaleTo,
  clampStackOffset,
  resolveScrub,
  SCROLL_SCENE_DEFAULTS,
} from "./scroll/scroll-options";
import { useScrollScene, useScrollSceneMode } from "./scroll/use-scroll-scene";
import type { ScrollScrub } from "./scroll/scroll-types";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Pin each item at the top of the viewport. Previous items scale, fade, and
 * optionally translate as the next item arrives. Last item releases with pin spacing.
 */
export type StickyStackProps = {
  children: ReactNode;
  className?: string;
  /** Target scale for outgoing items. Clamped 0.5-1. Default 0.92. */
  scaleTo?: number;
  /** Target opacity for outgoing items. Clamped 0-1. Default 0.45. */
  opacityTo?: number;
  /** Extra translateY in px applied to outgoing items. Clamped 0-120. Default 0. */
  offset?: number;
  /** ScrollTrigger scrub. `true` or lag in seconds 0-2. Default true. */
  scrub?: ScrollScrub;
  /** Collapse to a normal vertical sequence below this width. Default 768. */
  disableBelow?: number;
  /** Development markers and debug attributes. Default false. */
  debug?: boolean;
};

export type StickyStackItemProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function StickyStack({
  children,
  className,
  scaleTo = SCROLL_SCENE_DEFAULTS.scaleTo,
  opacityTo = SCROLL_SCENE_DEFAULTS.opacityTo,
  offset = SCROLL_SCENE_DEFAULTS.offset,
  scrub = SCROLL_SCENE_DEFAULTS.scrub,
  disableBelow = SCROLL_BREAKPOINTS.collapseBelow,
  debug = false,
}: StickyStackProps) {
  const scope = useRef<HTMLDivElement>(null);
  const resolvedScale = clampScaleTo(scaleTo);
  const resolvedOpacity = clampOpacityTo(opacityTo);
  const resolvedOffset = clampStackOffset(offset);
  const resolvedScrub = resolveScrub(scrub);
  const resolvedBreakpoint = clampDisableBelow(disableBelow);
  const mode = useScrollSceneMode(resolvedBreakpoint);

  useScrollScene({
    scope,
    id: "sticky-stack",
    debug,
    disableBelow: resolvedBreakpoint,
    dependencies: [
      resolvedScale,
      resolvedOpacity,
      resolvedOffset,
      resolvedScrub,
      Children.count(children),
    ],
    setup: ({ mode: sceneMode, markers, idPrefix, root }) => {
      if (sceneMode !== "pin") {
        return;
      }
      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-sticky-stack-item]"),
      );
      if (items.length === 0) {
        return;
      }

      items.forEach((item, index) => {
        const next = items[index + 1];
        const layer = item.querySelector<HTMLElement>(
          "[data-sticky-stack-layer]",
        );
        const isLast = !next;

        ScrollTrigger.create({
          id: `${idPrefix}-pin-${String(index)}`,
          trigger: item,
          start: "top top",
          endTrigger: next ?? item,
          end: next ? "top top" : "bottom top",
          pin: true,
          pinSpacing: isLast,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers,
        });

        if (next && layer) {
          gsap.to(layer, {
            scale: resolvedScale,
            opacity: resolvedOpacity,
            y: resolvedOffset,
            ease: SCROLL_SCENE_DEFAULTS.ease,
            transformOrigin: "center top",
            scrollTrigger: {
              id: `${idPrefix}-scrub-${String(index)}`,
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: resolvedScrub,
              invalidateOnRefresh: true,
              markers,
            },
          });
        }
      });
    },
  });

  return (
      <div
        ref={scope}
        className={cn("relative", className)}
        data-sticky-stack=""
        data-scroll-mode={mode}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) {
            return child;
          }
          const element = child as ReactElement<StickyStackItemProps>;
          return cloneElement(element, {
            style: {
              ...element.props.style,
              zIndex: `calc(var(--z-sticky) + ${String(index)})`,
            },
          });
        })}
      </div>
  );
}

export function StickyStackItem({
  children,
  className,
  ...props
}: StickyStackItemProps) {
  return (
    <article
      {...props}
      className={cn("relative", className)}
      data-sticky-stack-item=""
    >
      <div data-sticky-stack-layer="" className="h-full w-full">
        {children}
      </div>
    </article>
  );
}
