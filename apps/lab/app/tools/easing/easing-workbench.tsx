"use client";

import { Button } from "@cds/ui";
import {
  TWEEN_INTENTS,
  createMotionProfile,
  motionProfileToCss,
  motionProfileToGsapRegistration,
  motionProfileToJson,
  motionProfileToMotionTs,
  type CubicBezier,
  type TweenIntent,
} from "@cds/motion";
import { useEffect, useMemo, useState } from "react";
import { BezierEditor } from "./bezier-editor";
import { EasingSpecimens } from "./easing-specimens";
import {
  clearWorkbenchDraft,
  houseWorkbenchDraft,
  readWorkbenchDraft,
  writeWorkbenchDraft,
  type CurveSlotId,
  type WorkbenchDraft,
} from "./workbench-storage";

const SLOT_COLORS: Record<CurveSlotId, string> = {
  a: "var(--accent)",
  b: "color-mix(in oklch, var(--foreground) 55%, transparent)",
  c: "color-mix(in oklch, var(--foreground) 35%, var(--accent))",
};

function NumberField({
  id,
  label,
  value,
  step = 0.01,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-xs" htmlFor={id}>
      <span className="font-mono uppercase tracking-wider text-foreground/55">
        {label}
      </span>
      <input
        id={id}
        data-testid={id}
        className="h-9 w-full min-w-0 border border-border bg-surface px-2 font-mono text-sm"
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function EasingWorkbench() {
  const [draft, setDraft] = useState<WorkbenchDraft>(houseWorkbenchDraft);
  const [hydrated, setHydrated] = useState(false);
  const [playbackKey, setPlaybackKey] = useState(0);
  const [intent, setIntent] = useState<TweenIntent>("enter");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setDraft(readWorkbenchDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeWorkbenchDraft(draft);
  }, [draft, hydrated]);

  const active = draft.slots.find((slot) => slot.id === draft.activeSlot);
  const activeBezier = active?.bezier ?? draft.profile.easing.enter;
  const playDuration = draft.slowMo ? draft.duration * 4 : draft.duration;
  const profile = useMemo(() => {
    try {
      return createMotionProfile({}, draft.profile);
    } catch {
      return createMotionProfile();
    }
  }, [draft.profile]);

  function updateDraft(next: Partial<WorkbenchDraft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function setBezier(id: string, bezier: CubicBezier) {
    setDraft((current) => ({
      ...current,
      slots: current.slots.map((slot) =>
        slot.id === id ? { ...slot, bezier } : slot,
      ),
      profile: {
        ...current.profile,
        easing: {
          ...current.profile.easing,
          [intent]: id === current.activeSlot ? bezier : current.profile.easing[intent],
        },
      },
    }));
  }

  function setBezierComponent(index: 0 | 1 | 2 | 3, value: number) {
    const next: CubicBezier = [
      index === 0 ? value : activeBezier[0],
      index === 1 ? value : activeBezier[1],
      index === 2 ? value : activeBezier[2],
      index === 3 ? value : activeBezier[3],
    ];
    setBezier(draft.activeSlot, next);
  }

  const exports = {
    css: motionProfileToCss(profile),
    motion: motionProfileToMotionTs(profile),
    gsap: JSON.stringify(motionProfileToGsapRegistration(profile), null, 2),
    json: motionProfileToJson(profile),
  };

  return (
    <div data-testid="easing-workbench" data-hydrated={hydrated ? "true" : "false"} className="grid min-w-0 gap-10 overflow-x-hidden">
      <section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-4">
          <BezierEditor
            activeId={draft.activeSlot}
            slots={draft.slots.map((slot) => ({
              id: slot.id,
              bezier: slot.bezier,
              enabled: slot.enabled,
              color: SLOT_COLORS[slot.id],
            }))}
            onChange={setBezier}
          />
          <div className="grid grid-cols-2 gap-3" data-testid="bezier-inputs">
            <NumberField
              id="x1"
              label="X1"
              value={activeBezier[0]}
              onChange={(value) => setBezierComponent(0, value)}
            />
            <NumberField
              id="y1"
              label="Y1"
              value={activeBezier[1]}
              onChange={(value) => setBezierComponent(1, value)}
            />
            <NumberField
              id="x2"
              label="X2"
              value={activeBezier[2]}
              onChange={(value) => setBezierComponent(2, value)}
            />
            <NumberField
              id="y2"
              label="Y2"
              value={activeBezier[3]}
              onChange={(value) => setBezierComponent(3, value)}
            />
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1 text-xs" htmlFor="intent">
            <span className="font-mono uppercase tracking-wider text-foreground/55">
              Intent
            </span>
            <select
              id="intent"
              className="h-9 border border-border bg-surface px-2 text-sm"
              value={intent}
              onChange={(event) => {
                const next = event.target.value as TweenIntent;
                setIntent(next);
                setBezier(draft.activeSlot, draft.profile.easing[next]);
              }}
            >
              {TWEEN_INTENTS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            {draft.slots.map((slot) => (
              <label key={slot.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={slot.enabled}
                  disabled={slot.id === "a"}
                  onChange={(event) =>
                    updateDraft({
                      slots: draft.slots.map((entry) =>
                        entry.id === slot.id
                          ? { ...entry, enabled: event.target.checked }
                          : entry,
                      ),
                    })
                  }
                />
                Compare {slot.id.toUpperCase()}
                <button
                  type="button"
                  className="font-mono text-[11px] uppercase tracking-wider text-foreground/55"
                  onClick={() => updateDraft({ activeSlot: slot.id })}
                >
                  {draft.activeSlot === slot.id ? "editing" : "edit"}
                </button>
              </label>
            ))}
          </div>

          <NumberField
            id="duration"
            label="Duration (s)"
            value={draft.duration}
            step={0.01}
            onChange={(value) => updateDraft({ duration: value })}
          />
          <NumberField
            id="distance"
            label="Movement distance (px)"
            value={draft.distance}
            step={1}
            onChange={(value) => updateDraft({ distance: value })}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPlaybackKey((value) => value + 1)}
            >
              Replay
            </Button>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.slowMo}
                onChange={(event) => updateDraft({ slowMo: event.target.checked })}
              />
              Slow motion
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                data-testid="loop-toggle"
                checked={draft.loop}
                onChange={(event) => updateDraft({ loop: event.target.checked })}
              />
              Loop
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              id="stiffness"
              label="Spring stiffness"
              value={draft.spring.stiffness}
              step={1}
              onChange={(value) =>
                updateDraft({ spring: { ...draft.spring, stiffness: value } })
              }
            />
            <NumberField
              id="damping"
              label="Spring damping"
              value={draft.spring.damping}
              step={1}
              onChange={(value) =>
                updateDraft({ spring: { ...draft.spring, damping: value } })
              }
            />
            <NumberField
              id="mass"
              label="Spring mass"
              value={draft.spring.mass}
              step={0.1}
              onChange={(value) =>
                updateDraft({ spring: { ...draft.spring, mass: value } })
              }
            />
            <NumberField
              id="velocity"
              label="Initial velocity"
              value={draft.spring.velocity ?? 0}
              step={0.1}
              onChange={(value) =>
                updateDraft({ spring: { ...draft.spring, velocity: value } })
              }
            />
          </div>
        </div>
      </section>

      <EasingSpecimens
        bezier={activeBezier}
        duration={playDuration}
        distance={draft.distance}
        playbackKey={playbackKey}
        loop={draft.loop}
        spring={{ ...draft.spring, ...profile.spring.pop, ...draft.spring }}
      />

      <section className="border-t border-border pt-8">
        <h2 className="text-lg font-medium">Export</h2>
        <p className="mt-2 max-w-[65ch] text-sm text-foreground/75">
          Copy calibrated values into a project profile. Scroll-scrubbed
          timelines stay linear (`none`) even when a linear token exists.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["css", "CSS custom properties"],
              ["motion", "Motion TypeScript"],
              ["gsap", "GSAP registration data"],
              ["json", "Complete JSON profile"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              variant="secondary"
              size="sm"
              onClick={() => {
                void copyText(exports[key]).then(() => setCopied(key));
              }}
            >
              Copy {label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            data-testid="reset-house"
            onClick={() => {
              clearWorkbenchDraft();
              setDraft(houseWorkbenchDraft());
              setPlaybackKey((value) => value + 1);
            }}
          >
            Reset to house defaults
          </Button>
        </div>
        {copied ? (
          <p className="mt-3 font-mono text-xs text-foreground/55">
            Copied {copied}.
          </p>
        ) : null}
        <pre
          className="mt-4 overflow-x-auto border border-border bg-surface-muted p-4 font-mono text-xs"
          data-testid="export-json"
        >
          <code>{exports.json}</code>
        </pre>
      </section>
    </div>
  );
}
