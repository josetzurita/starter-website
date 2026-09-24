"use client";

import {

  clampStaggerInterval,

  MOTION_DEFAULTS,

} from "./clamp";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import { shouldAnimateMotion } from "./motion-policy";

import { resolveTween, toMotionEase } from "./resolve-tween";

import { useMotionProfile } from "./use-motion-profile";

import { motion, useReducedMotion } from "motion/react";

import {

  createElement,

  type ElementType,

  type ReactNode,

} from "react";

import type { CubicBezier, TweenIntent } from "./profiles/types";

export type StaggerProps = {

  children: ReactNode;

  className?: string;

  as?: ElementType;

  interval?: number;

  delay?: number;

  amount?: number;

  once?: boolean;

};

export type StaggerItemProps = {

  children: ReactNode;

  className?: string;

  as?: ElementType;

  y?: number;

  intent?: TweenIntent;

  ease?: CubicBezier;

  duration?: number;

};

const containerVariants = (interval: number, delay: number) => ({

  hidden: {},

  show: {

    transition: {

      staggerChildren: interval,

      delayChildren: delay,

    },

  },

});

const itemVariants = (

  y: number,

  duration: number,

  ease: CubicBezier,

) => ({

  hidden: { opacity: 0, y },

  show: {

    opacity: 1,

    y: 0,

    transition: {

      duration,

      ease: toMotionEase(ease),

    },

  },

});

export function Stagger({

  children,

  className,

  as = "div",

  interval,

  delay = MOTION_DEFAULTS.staggerDelay,

  amount = MOTION_DEFAULTS.staggerAmount,

  once = MOTION_DEFAULTS.staggerOnce,

}: StaggerProps) {

  const reduce = useReducedMotion();

  const profile = useMotionProfile();

  const Tag = as as ElementType;

  if (!shouldAnimateMotion(reduce)) {

    return createElement(Tag, { className }, children);

  }

  const Component = motion.create(Tag);

  return (

    <Component

      className={cn(className)}

      initial="hidden"

      whileInView="show"

      viewport={{ once, amount }}

      variants={containerVariants(

        clampStaggerInterval(interval ?? profile.stagger.normal),

        delay,

      )}

    >

      {children}

    </Component>

  );

}

export function StaggerItem({

  children,

  className,

  as = "div",

  y = MOTION_DEFAULTS.staggerY,

  intent = "enter",

  ease,

  duration,

}: StaggerItemProps) {

  const reduce = useReducedMotion();

  const profile = useMotionProfile();

  const tween = resolveTween(profile, { intent, ease, duration });

  const Tag = as as ElementType;

  if (!shouldAnimateMotion(reduce)) {

    return createElement(Tag, { className }, children);

  }

  const Component = motion.create(Tag);

  return (

    <Component

      className={cn(className)}

      variants={itemVariants(y, tween.duration, tween.ease)}

    >

      {children}

    </Component>

  );

}

