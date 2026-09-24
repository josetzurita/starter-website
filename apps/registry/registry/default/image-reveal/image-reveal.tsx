"use client";

import { clampImageScale, MOTION_DEFAULTS } from "./clamp";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import { shouldAnimateMotion } from "./motion-policy";

import { resolveTween, toMotionEase } from "./resolve-tween";

import { useMotionProfile } from "./use-motion-profile";

import { motion, useReducedMotion } from "motion/react";

import type { ReactNode } from "react";

import type { CubicBezier, TweenIntent } from "./profiles/types";

export type ImageRevealDirection = "up" | "down" | "left" | "right";

export type ImageRevealProps = {

  children: ReactNode;

  className?: string;

  direction?: ImageRevealDirection;

  scale?: number;

  amount?: number;

  once?: boolean;

  intent?: TweenIntent;

  ease?: CubicBezier;

  duration?: number;

};

function hiddenTransform(

  direction: ImageRevealDirection,

  scale: number,

): { opacity: number; x?: string; y?: string; scale: number } {

  switch (direction) {

    case "down":

      return { opacity: 1, y: "-24%", scale };

    case "left":

      return { opacity: 1, x: "24%", scale };

    case "right":

      return { opacity: 1, x: "-24%", scale };

    default:

      return { opacity: 1, y: "24%", scale };

  }

}

export function ImageReveal({

  children,

  className,

  direction = "up",

  scale = MOTION_DEFAULTS.imageScale,

  amount = MOTION_DEFAULTS.staggerAmount,

  once = MOTION_DEFAULTS.staggerOnce,

  intent = "settle",

  ease,

  duration,

}: ImageRevealProps) {

  const reduce = useReducedMotion();

  const profile = useMotionProfile();

  const tween = resolveTween(profile, { intent, ease, duration });

  const nextScale = clampImageScale(scale);

  if (!shouldAnimateMotion(reduce)) {

    return <div className={cn("overflow-hidden", className)}>{children}</div>;

  }

  return (

    <div className={cn("overflow-hidden", className)}>

      <motion.div

        initial={hiddenTransform(direction, nextScale)}

        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}

        viewport={{ once, amount }}

        transition={{

          duration: tween.duration,

          ease: toMotionEase(tween.ease),

        }}

      >

        {children}

      </motion.div>

    </div>

  );

}

