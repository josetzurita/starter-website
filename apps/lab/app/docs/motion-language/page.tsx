export default function MotionLanguagePage() {
  return (
    <main className="px-6 py-10 md:px-12 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Motion language
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">Motion language</h1>
      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground/75">
        Standardize motion by intent. Do not apply one curve to every node.
        House values are a starting calibration, not immutable constants.
      </p>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Intent tokens</h2>
        <dl className="mt-4 grid gap-3 font-mono text-sm">
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">enter</dt>
            <dd>Expressive ease-out for entrances. Reveal, Stagger, and TextReveal default here.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">settle</dt>
            <dd>Controlled ease-out for larger media and layout movement. ImageReveal defaults here.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">move</dt>
            <dd>Balanced in-out for visible repositioning.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">exit</dt>
            <dd>Quicker ease-in for removal.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">pop</dt>
            <dd>Spring for small tactile responses. Not a cubic Bézier.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">linear</dt>
            <dd>Named token for time-mapped motion. Scroll-scrubbed timelines still use GSAP none.</dd>
          </div>
        </dl>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">House defaults versus project profiles</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          `@cds/motion` ships `HOUSE_MOTION_PROFILE` and `houseMotionProfile`. A
          project wraps `MotionProfileProvider` with `createMotionProfile` to
          override selected tokens. Missing keys inherit house values. Invalid
          X control points, non-positive durations, or invalid springs throw
          `MotionProfileError`.
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">When to use tweens</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Use cubic Bézier tweens when the motion has a known duration: page
          entrances, exits, and directed moves. Pick the intent that matches
          the job instead of reusing enter everywhere.
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">When to use springs</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Use the pop spring for small controls that can be interrupted.
          Springs are a poor default for large media, long travels, and
          scroll-linked work.
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Scroll-scrubbed timelines stay linear</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Scrubbed ScrollTrigger animations map progress to scroll position.
          Easing that progress would desync the visual from the scroll thumb.
          `GSAP_SCROLL_SCRUB_EASE` is `none`. Do not apply a profile curve to
          ScrollProgress merely because the profile exists. Parallax and
          ScrollProgress remain scroll-driven.
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Lenis physics versus animation easing</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Lenis lerp smooths wheel input on fine-pointer desktops. That is
          scroll physics, not an animation curve. Do not reuse `cds-enter` as
          a substitute for Lenis lerp, and do not put Lenis on a Motion node.
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Override a profile per project</h2>
        <pre className="mt-3 overflow-x-auto border border-border bg-surface-muted p-4 font-mono text-xs">
          <code>{`import {
  MotionProfileProvider,
  MotionProvider,
  SmoothScrollProvider,
  createMotionProfile,
} from "@cds/motion";

const projectMotionProfile = createMotionProfile({
  easing: { enter: [0.2, 1, 0.24, 1] },
  duration: { base: 0.48 },
});

<MotionProvider>
  <MotionProfileProvider profile={projectMotionProfile}>
    <SmoothScrollProvider>{children}</SmoothScrollProvider>
  </MotionProfileProvider>
</MotionProvider>`}</code>
        </pre>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Primitives still accept a raw `ease` or `duration` prop as an escape
          hatch. Magnetic stays experimental. Calibrate in `/tools/easing`, then
          paste the exported profile. Do not ship the workbench to clients.
        </p>
      </section>
    </main>
  );
}
