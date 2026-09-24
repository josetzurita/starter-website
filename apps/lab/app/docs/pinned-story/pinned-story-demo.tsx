"use client";

import { countScrollTriggers, PinnedStory } from "@cds/motion";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ScrollSceneHud } from "../../../components/scroll-scene-hud";

type Step = {
  id: string;
  title: string;
  copy: string;
};

const steps: Step[] = [
  {
    id: "01",
    title: "Measure the scene",
    copy: "The visual stays put while this copy moves through the document. Active index is discrete.",
  },
  {
    id: "02",
    title: "Keep progress off state",
    copy: "Frame progress is a motion value updated from ScrollTrigger. Do not store it in React state.",
  },
  {
    id: "03",
    title: "Hand the visual to the project",
    copy: "Crossfade, canvas, or a still frame are all valid. This primitive only exposes index and progress.",
  },
  {
    id: "04",
    title: "Release the pin",
    copy: "When the last step leaves, the visual unpins and the following section can take the viewport.",
  },
];

export function PinnedStoryDemo() {
  const [debug, setDebug] = useState(false);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount(countScrollTriggers("cds-pinned-story"));
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div data-testid="pinned-story-live" className="grid gap-8">
      <ScrollSceneHud
        triggerCount={count}
        debug={debug}
        onDebugChange={setDebug}
        extra={`activeIndex ${String(active)}`}
      />

      <a className="text-sm underline" href="#pinned-story-after">
        After the story
      </a>

      <PinnedStory
        steps={steps}
        debug={debug}
        onActiveIndexChange={setActive}
        renderVisual={({ activeIndex, steps: sceneSteps, frameProgress }) => (
          <div className="border border-border bg-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
              Visual {sceneSteps[activeIndex]?.id}
            </p>
            <p className="mt-3 text-lg font-medium" data-testid="pinned-story-visual-title">
              {sceneSteps[activeIndex]?.title}
            </p>
            <motion.div
              className="mt-6 h-1 origin-left bg-accent"
              style={{ scaleX: frameProgress }}
              data-testid="pinned-story-progress"
            />
          </div>
        )}
        renderStep={({ step, index, isActive }) => (
          <article className="min-h-[70vh] border-t border-border pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
              Step {step.id}
              {isActive ? " active" : ""}
            </p>
            <h2 className="mt-4 text-2xl font-medium">{step.title}</h2>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-foreground/75">
              {step.copy}
            </p>
            <button
              type="button"
              className="mt-6 border border-border px-3 py-2 text-sm"
            >
              Step control {index + 1}
            </button>
          </article>
        )}
      />

      <section
        id="pinned-story-after"
        data-testid="pinned-story-after"
        className="min-h-[40vh] border-t border-border pt-8"
      >
        <h2 className="text-lg font-medium">After</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          The pin must release so this copy is reachable by keyboard and anchors.
        </p>
      </section>
    </div>
  );
}
