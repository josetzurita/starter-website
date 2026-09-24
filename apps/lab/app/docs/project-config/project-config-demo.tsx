"use client";

import { validateProjectConfig } from "@cds/project";
import { useMemo, useState } from "react";

const sample = `{
  "site": {
    "name": "North Studio",
    "shortName": "north-studio",
    "description": "A client production site.",
    "locale": "en",
    "canonicalUrl": "https://north.example"
  },
  "theme": { "mode": "system", "radius": "md" },
  "motion": {
    "profile": "house",
    "smoothScroll": true,
    "pageTransition": "overlay"
  },
  "features": { "analytics": false, "cms": false },
  "pointerAccent": {
    "enabled": false,
    "size": 14,
    "color": "oklch(0.97 0.004 250)",
    "opacity": 1,
    "shape": "circle",
    "lag": 0.4,
    "ease": "power3.out",
    "stretch": 0.2,
    "maxStretch": 0.6,
    "offsetX": 0,
    "offsetY": 0,
    "blendMode": "difference",
    "zIndex": "debug"
  }
}`;

export function ProjectConfigDemo() {
  const [text, setText] = useState(sample);
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(text) as unknown;
      const config = validateProjectConfig(parsed, { production: true });
      return { ok: true as const, config };
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Invalid configuration",
      };
    }
  }, [text]);

  return (
    <div data-testid="project-config-live" className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Configuration JSON
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-64 border border-border bg-surface p-3 font-mono text-xs"
        />
      </label>
      <p data-testid="project-config-result" className="text-sm">
        {result.ok ? `Valid: ${result.config.site.name}` : result.message}
      </p>
    </div>
  );
}
