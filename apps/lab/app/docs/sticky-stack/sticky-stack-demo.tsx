"use client";

import {
  countScrollTriggers,
  StickyStack,
  StickyStackItem,
} from "@cds/motion";
import { useEffect, useState } from "react";
import { ScrollSceneHud } from "../../../components/scroll-scene-hud";

const heights = ["min-h-[70vh]", "min-h-[90vh]", "min-h-[60vh]", "min-h-[80vh]"];

export function StickyStackDemo() {
  const [scaleTo, setScaleTo] = useState(0.92);
  const [opacityTo, setOpacityTo] = useState(0.45);
  const [offset, setOffset] = useState(0);
  const [debug, setDebug] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount(countScrollTriggers("cds-sticky-stack"));
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div data-testid="sticky-stack-live" className="grid gap-8">
      <ScrollSceneHud
        triggerCount={count}
        debug={debug}
        onDebugChange={setDebug}
        extra={`scaleTo ${String(scaleTo)} / opacityTo ${String(opacityTo)} / offset ${String(offset)}`}
      />

      <div className="grid gap-3 text-sm">
        <label className="grid gap-1">
          scaleTo
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.01"
            value={scaleTo}
            onChange={(event) => setScaleTo(Number(event.target.value))}
            data-testid="sticky-scale"
          />
        </label>
        <label className="grid gap-1">
          opacityTo
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacityTo}
            onChange={(event) => setOpacityTo(Number(event.target.value))}
            data-testid="sticky-opacity"
          />
        </label>
        <label className="grid gap-1">
          offset
          <input
            type="range"
            min="0"
            max="80"
            step="4"
            value={offset}
            onChange={(event) => setOffset(Number(event.target.value))}
            data-testid="sticky-offset"
          />
        </label>
      </div>

      <a className="text-sm underline" href="#sticky-stack-after">
        After the stack
      </a>

      <StickyStack
        scaleTo={scaleTo}
        opacityTo={opacityTo}
        offset={offset}
        debug={debug}
      >
        {heights.map((height, index) => (
          <StickyStackItem
            key={height}
            className={`${height} border border-border bg-surface p-6`}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
              Layer {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 text-2xl font-medium">
              Specimen block {index + 1}
            </h2>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-foreground/75">
              Arbitrary children. The primitive does not prescribe card chrome.
              Height varies so pinning cannot assume a single panel size.
            </p>
            <button
              type="button"
              className="mt-6 border border-border px-3 py-2 text-sm"
            >
              Keyboard target {index + 1}
            </button>
          </StickyStackItem>
        ))}
      </StickyStack>

      <section
        id="sticky-stack-after"
        data-testid="sticky-stack-after"
        className="min-h-[50vh] border-t border-border pt-8"
      >
        <h2 className="text-lg font-medium">Release</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          The last item must unpin so this section can reach the viewport.
        </p>
      </section>
    </div>
  );
}
