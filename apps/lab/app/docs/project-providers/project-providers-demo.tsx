"use client";

import { ProjectProviders, defaultPointerAccentConfig, type ProjectConfig } from "@cds/project";
import { useState } from "react";

const base: ProjectConfig = {
  site: {
    name: "North Studio",
    shortName: "north-studio",
    description: "A client production site.",
    locale: "en",
    canonicalUrl: "https://north.example",
  },
  theme: { mode: "system", radius: "md" },
  motion: { profile: "house", smoothScroll: false, pageTransition: "none" },
  features: { analytics: false, cms: false },
  pointerAccent: defaultPointerAccentConfig(),
};

export function ProjectProvidersDemo() {
  const [smooth, setSmooth] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const config: ProjectConfig = {
    ...base,
    motion: {
      profile: "house",
      smoothScroll: false,
      pageTransition: overlay ? "overlay" : "none",
    },
  };

  return (
    <div data-testid="project-providers-live" className="grid gap-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={smooth}
          onChange={(event) => setSmooth(event.target.checked)}
        />
        Smooth scroll flag
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={overlay}
          onChange={(event) => setOverlay(event.target.checked)}
        />
        Overlay transitions
      </label>
      <p data-testid="providers-flags" className="font-mono text-xs">
        smoothScroll {smooth ? "true" : "false"} / pageTransition{" "}
        {overlay ? "overlay" : "none"}
      </p>
      <p className="text-sm text-foreground/70">
        The lab already has one Lenis instance. This specimen never mounts a
        second SmoothScrollProvider.
      </p>
      <ProjectProviders config={config}>
        <p data-testid="providers-child" className="text-sm">
          Motion providers stay on. Overlay controller mounts only when enabled.
        </p>
      </ProjectProviders>
    </div>
  );
}
