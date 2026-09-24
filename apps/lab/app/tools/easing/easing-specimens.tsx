"use client";

import { Button } from "@cds/ui";
import {
  ImageReveal,
  TextReveal,
  type CubicBezier,
  type SpringConfig,
} from "@cds/motion";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

type SpecimenId =
  | "text"
  | "pop"
  | "image"
  | "panel"
  | "crossfade"
  | "words"
  | "horizontal"
  | "scale";

export function EasingSpecimens({
  bezier,
  duration,
  distance,
  playbackKey,
  loop,
  spring,
}: {
  bezier: CubicBezier;
  duration: number;
  distance: number;
  playbackKey: number;
  loop: boolean;
  spring: SpringConfig;
}) {
  const reduce = useReducedMotion();
  const ease: [number, number, number, number] = [
    bezier[0],
    bezier[1],
    bezier[2],
    bezier[3],
  ];
  const transition = {
    duration,
    ease,
    repeat: loop && !reduce ? Infinity : 0,
    repeatType: "reverse" as const,
  };

  return (
    <div className="grid gap-8" data-testid="easing-specimens">
      <SpecimenFrame id="text" label="Vertical text entrance">
        <motion.p
          key={`${String(playbackKey)}-text`}
          className="text-2xl font-medium"
          initial={{ opacity: 0, y: distance }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          Entrance copy
        </motion.p>
      </SpecimenFrame>

      <SpecimenFrame id="pop" label="Small control pop">
        <PopControl spring={spring} />
      </SpecimenFrame>

      <SpecimenFrame id="image" label="Large image settle">
        <ImageReveal
          key={`${String(playbackKey)}-image`}
          className="h-40 w-full"
          ease={bezier}
          duration={duration}
        >
          <div className="h-40 w-full bg-surface-muted" />
        </ImageReveal>
      </SpecimenFrame>

      <SpecimenFrame id="panel" label="Navigation panel opening">
        <motion.div
          key={`${String(playbackKey)}-panel`}
          className="h-28 w-40 border border-border bg-surface p-4 text-sm"
          initial={{ opacity: 0, x: -distance }}
          animate={{ opacity: 1, x: 0 }}
          transition={transition}
        >
          Index rail
        </motion.div>
      </SpecimenFrame>

      <SpecimenFrame id="crossfade" label="Crossfade">
        <div className="relative h-20 w-40">
          <motion.div
            key={`${String(playbackKey)}-fade-a`}
            className="absolute inset-0 bg-surface-muted"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={transition}
          />
          <motion.div
            key={`${String(playbackKey)}-fade-b`}
            className="absolute inset-0 border border-border bg-surface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition}
          />
        </div>
      </SpecimenFrame>

      <SpecimenFrame id="words" label="Staggered words">
        <TextReveal
          key={`${String(playbackKey)}-words`}
          text="Calibrate the stagger before copy ships."
          ease={bezier}
          duration={duration}
        />
      </SpecimenFrame>

      <SpecimenFrame id="horizontal" label="Horizontal movement">
        <motion.div
          key={`${String(playbackKey)}-x`}
          className="h-8 w-8 bg-accent"
          initial={{ x: 0 }}
          animate={{ x: distance }}
          transition={transition}
        />
      </SpecimenFrame>

      <SpecimenFrame id="scale" label="Scale from 0.96 to 1">
        <motion.div
          key={`${String(playbackKey)}-scale`}
          className="h-16 w-24 border border-border bg-surface"
          initial={{ scale: 0.96, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={transition}
        />
      </SpecimenFrame>
    </div>
  );
}

function SpecimenFrame({
  id,
  label,
  children,
}: {
  id: SpecimenId;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-4">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </h3>
      <div className="mt-3 overflow-hidden" data-testid={`specimen-${id}`}>
        {children}
      </div>
    </section>
  );
}

function PopControl({ spring }: { spring: SpringConfig }) {
  const [scope, animate] = useAnimate();
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div ref={scope} className="inline-block">
      <Button
        variant="secondary"
        data-testid="pop-control"
        onClick={() => {
          setCount((value) => value + 1);
          if (reduce) {
            return;
          }
          void animate(
            scope.current,
            { scale: 1.08 },
            {
              type: "spring",
              stiffness: spring.stiffness,
              damping: spring.damping,
              mass: spring.mass,
              velocity: spring.velocity ?? 0,
            },
          ).then(() =>
            animate(
              scope.current,
              { scale: 1 },
              {
                type: "spring",
                stiffness: spring.stiffness,
                damping: spring.damping,
                mass: spring.mass,
              },
            ),
          );
        }}
      >
        Pop {count}
      </Button>
    </div>
  );
}
