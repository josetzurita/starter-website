"use client";

import { shouldAnimateMotion } from "./motion-policy";
import { motion, useReducedMotion, useScroll } from "motion/react";
import type { RefObject } from "react";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

export type ScrollProgressAxis = "x" | "y";

export type ScrollProgressProps = {
  className?: string;
  axis?: ScrollProgressAxis;
  /**
   * @experimental Container-scoped progress. Prefer page scope.
   * Requires `containerRef` when set to `container`.
   */
  scope?: "page" | "container";
  /**
   * @experimental Scroll target when `scope` is `container`.
   */
  containerRef?: RefObject<HTMLElement | null>;
};

export function ScrollProgress({
  className,
  axis = "x",
  scope = "page",
  containerRef,
}: ScrollProgressProps) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll(
    scope === "container"
      ? {
          target: containerRef,
          offset: ["start start", "end end"],
        }
      : undefined,
  );
  const progress = scrollYProgress;
  const isVertical = axis === "y";
  const reduced = !shouldAnimateMotion(reduce);

  return (
    <motion.div
      className={cn(
        "pointer-events-none bg-accent",
        isVertical
          ? "fixed top-0 left-0 h-full w-0.5 origin-top"
          : "fixed top-0 left-0 h-0.5 w-full origin-left",
        "z-[var(--z-sticky)]",
        className,
      )}
      style={
        isVertical
          ? { scaleY: reduced ? 1 : progress }
          : { scaleX: reduced ? 1 : progress }
      }
    />
  );
}
