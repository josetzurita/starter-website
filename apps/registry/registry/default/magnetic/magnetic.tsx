"use client";

import {
  clampMagneticOffset,
  clampMagneticStrength,
  MOTION_DEFAULTS,
} from "./clamp";
import { FINE_POINTER_QUERY, shouldEnableMagnetic } from "./motion-policy";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type PointerEvent,
  type ReactNode,
} from "react";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

export type MagneticProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  strength?: number;
  maxOffset?: number;
};

export function Magnetic({
  children,
  className,
  as = "div",
  strength = MOTION_DEFAULTS.magneticStrength,
  maxOffset = MOTION_DEFAULTS.magneticMaxOffset,
}: MagneticProps) {
  const reduce = useReducedMotion();
  const Tag = as as ElementType;
  const Component = motion.create(Tag);
  const ref = useRef<HTMLElement | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 240, damping: 20, mass: 0.35 });
  const clampedStrength = clampMagneticStrength(strength);
  const clampedOffset = clampMagneticOffset(maxOffset);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const update = () => {
      setFinePointer(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  function reset() {
    x.set(0);
    y.set(0);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (
      !shouldEnableMagnetic({
        reduce,
        finePointer,
        pointerType: event.pointerType,
      })
    ) {
      reset();
      return;
    }
    const node = ref.current;
    if (!node) {
      return;
    }
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-clampedOffset, Math.min(clampedOffset, dx * clampedStrength)));
    y.set(Math.max(-clampedOffset, Math.min(clampedOffset, dy * clampedStrength)));
  }

  return (
    <Component
      ref={ref}
      className={cn(className)}
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </Component>
  );
}
