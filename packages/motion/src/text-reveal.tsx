"use client";



import { cn } from "@cds/core";

import {

  clampStaggerInterval,

  MOTION_DEFAULTS,

} from "./clamp";

import { shouldAnimateMotion } from "./motion-policy";

import {

  accessibleTextFromLines,

  splitTextParts,

} from "./text-split";

import { resolveTween, toMotionEase } from "./resolve-tween";

import { useMotionProfile } from "./use-motion-profile";

import { motion, useReducedMotion } from "motion/react";

import {

  createElement,

  type CSSProperties,

  type ElementType,

} from "react";

import type { CubicBezier, TweenIntent } from "./profiles/types";



export type TextRevealProps = {

  text: string;

  mode?: "words" | "lines";

  lines?: string[];

  className?: string;

  as?: ElementType;

  interval?: number;

  delay?: number;

  amount?: number;

  once?: boolean;

  intent?: TweenIntent;

  ease?: CubicBezier;

  duration?: number;

};



const visuallyHidden: CSSProperties = {

  position: "absolute",

  width: 1,

  height: 1,

  padding: 0,

  margin: -1,

  overflow: "hidden",

  clip: "rect(0, 0, 0, 0)",

  whiteSpace: "nowrap",

  borderWidth: 0,

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



const fragmentVariants = (duration: number, ease: CubicBezier) => ({

  hidden: { opacity: 0, y: 12 },

  show: {

    opacity: 1,

    y: 0,

    transition: {

      duration,

      ease: toMotionEase(ease),

    },

  },

});



export function TextReveal({

  text,

  mode = "words",

  lines,

  className,

  as = "p",

  interval,

  delay = MOTION_DEFAULTS.staggerDelay,

  amount = MOTION_DEFAULTS.staggerAmount,

  once = MOTION_DEFAULTS.staggerOnce,

  intent = "enter",

  ease,

  duration,

}: TextRevealProps) {

  const reduce = useReducedMotion();

  const profile = useMotionProfile();

  const tween = resolveTween(profile, { intent, ease, duration });

  const Tag = as as ElementType;

  const accessible = accessibleTextFromLines(text, lines ?? []);



  if (!shouldAnimateMotion(reduce)) {

    return createElement(

      Tag,

      { className, "data-text-reveal-text": "" },

      accessible,

    );

  }



  const variants = fragmentVariants(tween.duration, tween.ease);

  const lineItems = lines ?? [text];

  const fragments =

    mode === "lines"

      ? lineItems.map((line, index) => (

          <motion.span

            key={`line-${String(index)}`}

            className="inline-block"

            variants={variants}

          >

            {line}

            {index < lineItems.length - 1 ? " " : null}

          </motion.span>

        ))

      : splitTextParts(text).map((part, index) =>

          part.type === "space" ? (

            <span key={`space-${String(index)}`}>{part.value}</span>

          ) : (

            <motion.span

              key={`word-${String(index)}`}

              className="inline-block"

              variants={variants}

            >

              {part.value}

            </motion.span>

          ),

        );



  return createElement(

    Tag,

    { className: cn("relative", className) },

    <span data-text-reveal-text="" style={visuallyHidden}>

      {accessible}

    </span>,

    <motion.span

      data-text-reveal-visual=""

      aria-hidden="true"

      initial="hidden"

      whileInView="show"

      viewport={{ once, amount }}

      variants={containerVariants(

        clampStaggerInterval(interval ?? profile.stagger.normal),

        delay,

      )}

    >

      {fragments}

    </motion.span>,

  );

}

