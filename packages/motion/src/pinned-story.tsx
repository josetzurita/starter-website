"use client";

import { cn } from "@cds/core";
import { useMotionValue, type MotionValue } from "motion/react";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import { ScrollTrigger } from "./gsap";
import { SCROLL_BREAKPOINTS } from "./scroll/scroll-breakpoints";
import { clampDisableBelow } from "./scroll/scroll-options";
import { useScrollScene, useScrollSceneMode } from "./scroll/use-scroll-scene";

export type PinnedStoryVisualContext<T> = {
  activeIndex: number;
  steps: T[];
  frameProgress: MotionValue<number>;
  sceneProgress: MotionValue<number>;
  progressRef: RefObject<number>;
};

export type PinnedStoryStepContext<T> = {
  step: T;
  index: number;
  isActive: boolean;
  steps: T[];
};

/**
 * Pin a visual while document steps drive a discrete active index.
 * Frame progress is a motion value, not React state.
 */
export type PinnedStoryProps<T> = {
  steps: T[];
  renderVisual: (ctx: PinnedStoryVisualContext<T>) => ReactNode;
  renderStep: (ctx: PinnedStoryStepContext<T>) => ReactNode;
  className?: string;
  visualClassName?: string;
  stepsClassName?: string;
  /** Called when the discrete active step changes. */
  onActiveIndexChange?: (index: number) => void;
  /** Called from ScrollTrigger onUpdate. Do not copy this into React state. */
  onFrameProgress?: (ctx: { index: number; progress: number }) => void;
  /** Collapse below this width. Default 768. */
  disableBelow?: number;
  /** Development markers and debug attributes. Default false. */
  debug?: boolean;
};

export function PinnedStory<T>({
  steps,
  renderVisual,
  renderStep,
  className,
  visualClassName,
  stepsClassName,
  onActiveIndexChange,
  onFrameProgress,
  disableBelow = SCROLL_BREAKPOINTS.collapseBelow,
  debug = false,
}: PinnedStoryProps<T>) {
  const scope = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const activeRef = useRef(0);
  const onActiveRef = useRef(onActiveIndexChange);
  const onProgressRef = useRef(onFrameProgress);
  onActiveRef.current = onActiveIndexChange;
  onProgressRef.current = onFrameProgress;
  const frameProgress = useMotionValue(0);
  const sceneProgress = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const resolvedBreakpoint = clampDisableBelow(disableBelow);
  const mode = useScrollSceneMode(resolvedBreakpoint);
  const pinned = mode === "pin";

  useScrollScene({
    scope,
    id: "pinned-story",
    debug,
    disableBelow: resolvedBreakpoint,
    dependencies: [steps.length, pinned],
    setup: ({ mode: sceneMode, markers, idPrefix, root }) => {
      const visual = visualRef.current;
      const stepNodes = Array.from(
        root.querySelectorAll<HTMLElement>("[data-pinned-story-step]"),
      );
      if (stepNodes.length === 0) {
        return;
      }

      const setIndex = (index: number) => {
        if (activeRef.current === index) {
          return;
        }
        activeRef.current = index;
        setActiveIndex(index);
        onActiveRef.current?.(index);
      };

      if (sceneMode === "reduced-motion") {
        return;
      }

      if (sceneMode !== "pin" || !visual) {
        stepNodes.forEach((step, index) => {
          ScrollTrigger.create({
            id: `${idPrefix}-step-${String(index)}`,
            trigger: step,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (self.isActive) {
                setIndex(index);
              }
            },
            onUpdate: (self) => {
              progressRef.current = self.progress;
              frameProgress.set(self.progress);
              onProgressRef.current?.({ index, progress: self.progress });
            },
            markers,
          });
        });
        return;
      }

      ScrollTrigger.create({
        id: `${idPrefix}-pin`,
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        pin: visual,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers,
        onUpdate: (self) => {
          sceneProgress.set(self.progress);
        },
      });

      stepNodes.forEach((step, index) => {
        ScrollTrigger.create({
          id: `${idPrefix}-step-${String(index)}`,
          trigger: step,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setIndex(index);
            }
          },
          onUpdate: (self) => {
            progressRef.current = self.progress;
            frameProgress.set(self.progress);
            onProgressRef.current?.({ index, progress: self.progress });
          },
          markers,
        });
      });
    },
  });

  const visualContext: PinnedStoryVisualContext<T> = {
    activeIndex,
    steps,
    frameProgress,
    sceneProgress,
    progressRef,
  };

  if (!pinned) {
    return (
      <div
        ref={scope}
        className={cn("grid gap-10", className)}
        data-pinned-story=""
        data-scroll-mode={mode}
        data-active-index={String(activeIndex)}
      >
        {steps.map((step, index) => (
          <section
            key={index}
            data-pinned-story-step=""
            data-step-index={String(index)}
            className={cn(stepsClassName)}
          >
            <div
              className={cn(visualClassName)}
              data-pinned-story-visual=""
              data-visual-index={String(index)}
            >
              {renderVisual({ ...visualContext, activeIndex: index })}
            </div>
            {renderStep({
              step,
              index,
              isActive: index === activeIndex,
              steps,
            })}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={scope}
      className={cn(
        "grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start",
        className,
      )}
      data-pinned-story=""
      data-scroll-mode={mode}
      data-active-index={String(activeIndex)}
    >
      <div
        ref={visualRef}
        className={cn("relative", visualClassName)}
        data-pinned-story-visual=""
      >
        {renderVisual(visualContext)}
      </div>
      <div className={cn("grid gap-24", stepsClassName)}>
        {steps.map((step, index) => (
          <section
            key={index}
            data-pinned-story-step=""
            data-step-index={String(index)}
          >
            {renderStep({
              step,
              index,
              isActive: index === activeIndex,
              steps,
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
