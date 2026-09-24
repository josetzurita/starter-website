"use client";

import {
  ProjectProviders,
  TransitionLink,
  defaultPointerAccentConfig,
  useRouteTransition,
  type ProjectConfig,
  type RouteTransitionState,
} from "@cds/project";

const config: ProjectConfig = {
  site: {
    name: "North Studio",
    shortName: "north-studio",
    description: "A client production site.",
    locale: "en",
    canonicalUrl: "https://north.example",
  },
  theme: { mode: "system", radius: "md" },
  motion: { profile: "house", smoothScroll: false, pageTransition: "overlay" },
  features: { analytics: false, cms: false },
  pointerAccent: defaultPointerAccentConfig(),
};

function RecoveryProbe() {
  const transition = useRouteTransition();
  return (
    <button
      type="button"
      data-testid="recover-timeout"
      onClick={() => transition.navigate("/docs/route-transitions")}
    >
      Same-route recovery
    </button>
  );
}

function Overlay({ phase }: RouteTransitionState) {
  const visible = phase !== "idle";
  return (
    <div
      data-testid="lab-route-overlay"
      data-phase={phase}
      className="pointer-events-none fixed left-1/2 top-4 -translate-x-1/2 border border-border bg-surface px-3 py-1 font-mono text-xs"
      style={{ zIndex: "var(--z-overlay)", opacity: visible ? 1 : 0 }}
    >
      {phase}
    </div>
  );
}

export function RouteTransitionsDemo() {
  return (
    <div data-testid="route-transitions-live" className="grid gap-4 text-sm">
      <ProjectProviders
        config={config}
        transitionTimeoutMs={800}
        renderOverlay={(state) => <Overlay {...state} />}
      >
        <TransitionLink href="/docs/project-config">Internal</TransitionLink>
        <a href="https://example.com">External</a>
        <a href="#recovery">Hash</a>
        <a href="/docs/project-config" target="_blank" rel="noreferrer">
          New tab
        </a>
        <RecoveryProbe />
        <p id="recovery">Hash target stays on this page.</p>
      </ProjectProviders>
    </div>
  );
}
