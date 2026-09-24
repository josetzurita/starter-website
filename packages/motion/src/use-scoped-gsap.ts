"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { registerGsap } from "./gsap";

type Scope = RefObject<Element | null>;

/**
 * Scoped GSAP setup with automatic revert on unmount and on dependency change.
 */
export function useScopedGsap(
  callback: () => void | (() => void),
  scope: Scope,
  dependencies: unknown[] = [],
) {
  registerGsap();
  useGSAP(callback, { scope, dependencies, revertOnUpdate: true });
}
