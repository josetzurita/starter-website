import type { ElementType, ReactNode } from "react";

export type RevealTweenIntent = "enter" | "settle" | "move" | "exit" | "linear";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
  y?: number;
  intent?: RevealTweenIntent;
  ease?: readonly [number, number, number, number];
  duration?: number;
};
