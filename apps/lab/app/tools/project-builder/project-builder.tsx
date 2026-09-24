"use client";

import { registryItemsForPreset, type ProjectPreset } from "@cds/project";
import { useMemo, useState } from "react";

const presets: ProjectPreset[] = ["minimal", "creative", "storytelling"];

export function ProjectBuilder() {
  const [preset, setPreset] = useState<ProjectPreset>("minimal");
  const [name, setName] = useState("north-studio");
  const items = useMemo(() => registryItemsForPreset(preset), [preset]);
  const command = `pnpm create:site ${name} --preset ${preset}`;

  return (
    <div data-testid="project-builder-live" className="grid max-w-[40rem] gap-6">
      <label className="grid gap-2 text-sm">
        Project name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="border border-border bg-surface px-3 py-2 font-mono text-sm"
        />
      </label>
      <fieldset className="grid gap-2 text-sm">
        <legend>Preset</legend>
        {presets.map((value) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="radio"
              name="preset"
              checked={preset === value}
              onChange={() => setPreset(value)}
            />
            {value}
          </label>
        ))}
      </fieldset>
      <section>
        <h2 className="text-sm font-medium">Included modules</h2>
        <ul className="mt-2 font-mono text-xs">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-sm font-medium">Generated configuration</h2>
        <pre className="mt-2 overflow-x-auto border border-border bg-surface-muted p-3 font-mono text-xs">
          {JSON.stringify(
            {
              name,
              preset,
              motion:
                preset === "minimal"
                  ? { smoothScroll: false, pageTransition: "none" }
                  : { smoothScroll: true, pageTransition: "overlay" },
              pointerAccent: { enabled: false },
            },
            null,
            2,
          )}
        </pre>
      </section>
      <section>
        <h2 className="text-sm font-medium">Command</h2>
        <pre
          data-testid="project-builder-command"
          className="mt-2 overflow-x-auto border border-border bg-surface-muted p-3 font-mono text-xs"
        >
          {command}
        </pre>
      </section>
    </div>
  );
}
