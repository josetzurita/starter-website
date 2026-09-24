"use client";

import { countScrollTriggers } from "@cds/motion/scroll-debug";
import { getGsapLenisSyncCount } from "@cds/motion/smooth-scroll-sync";
import { useEffect, useState } from "react";

export function ScrollTriggerProbe() {
  const [count, setCount] = useState(0);
  const [sync, setSync] = useState(0);

  useEffect(() => {
    const tick = () => {
      setCount(countScrollTriggers());
      setSync(getGsapLenisSyncCount());
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  return (
    <div
      className="sr-only"
      data-testid="global-scroll-trigger-count"
      data-count={String(count)}
      data-lenis-sync={String(sync)}
    >
      {count}
    </div>
  );
}

export function ScrollSceneHud({
  triggerCount,
  debug,
  onDebugChange,
  extra,
}: {
  triggerCount: number;
  debug: boolean;
  onDebugChange: (next: boolean) => void;
  extra?: string;
}) {
  return (
    <div
      className="sticky top-0 z-[var(--z-debug)] grid gap-3 border border-border bg-background/95 p-4 font-mono text-xs"
      data-testid="scroll-scene-hud"
    >
      <p data-testid="scroll-trigger-count">ScrollTrigger count: {triggerCount}</p>
      {extra ? <p data-testid="scroll-scene-extra">{extra}</p> : null}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={debug}
          onChange={(event) => {
            onDebugChange(event.target.checked);
          }}
          data-testid="scroll-debug-toggle"
        />
        Debug markers
      </label>
      {debug ? (
        <p className="text-foreground/55" data-testid="scroll-debug-hint">
          GSAP start/end markers are on. Trigger bounds use outline on
          data-cds-scroll-debug roots.
        </p>
      ) : null}
    </div>
  );
}
