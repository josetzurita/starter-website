"use client";

import { cn } from "@cds/core";
import { MOTION_DEFAULTS, parallaxTravelPx } from "./clamp";
import { shouldEnableParallax } from "./motion-policy";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Motion owns `transform` on this node. Do not tween the same element with GSAP
 * (ScrollTrigger or otherwise). Nested children may use a different engine only
 * if they do not animate transform or opacity on this wrapper.
 */
export type ParallaxProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  speed?: number;
  disableBelow?: number;
};

export function Parallax({
  children,
  className,
  as = "div",
  speed = MOTION_DEFAULTS.parallaxSpeed,
  disableBelow,
}: ParallaxProps) {
  const reduce = useReducedMotion();
  const Tag = as as ElementType;
  const Component = motion.create(Tag);
  const ref = useRef<HTMLElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number | null>(
    disableBelow == null ? null : disableBelow,
  );

  useEffect(() => {
    if (disableBelow == null) {
      setViewportWidth(null);
      return;
    }
    const media = window.matchMedia(
      `(max-width: ${String(disableBelow - 1)}px)`,
    );
    const update = () => {
      setViewportWidth(media.matches ? disableBelow - 1 : disableBelow);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, [disableBelow]);

  const enabled = shouldEnableParallax({
    reduce,
    viewportWidth,
    disableBelow,
  });
  const travel = enabled ? parallaxTravelPx(speed) : 0;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  return (
    <Component ref={ref} className={cn(className)} style={{ y }}>
      {children}
    </Component>
  );
}
