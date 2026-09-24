"use client";

import { motion, useReducedMotion } from "motion/react";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
  y?: number;
  intent?: "enter" | "settle" | "move" | "exit" | "linear";
  ease?: readonly [number, number, number, number];
  duration?: number;
};

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import { createElement, type ElementType, type ReactNode } from "react";

import { resolveTween, toMotionEase } from "./resolve-tween";

import { useMotionProfile } from "./use-motion-profile";

export function Reveal({

  children,

  className,

  as = "div",

  delay = 0,

  once = true,

  y = 16,

  intent = "enter",

  ease,

  duration,

}: RevealProps) {

  const reduce = useReducedMotion();

  const profile = useMotionProfile();

  const tween = resolveTween(profile, { intent, ease, duration });

  const Tag = as as ElementType;

  if (reduce) {

    return createElement(Tag, { className }, children);

  }

  const Component = motion.create(Tag);

  return (

    <Component

      className={cn(className)}

      initial={{ opacity: 0, y }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once, amount: 0.3 }}

      transition={{

        duration: tween.duration,

        delay,

        ease: toMotionEase(tween.ease),

      }}

    >

      {children}

    </Component>

  );

}

