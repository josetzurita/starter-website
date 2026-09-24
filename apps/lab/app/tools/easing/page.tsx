import { EasingWorkbench } from "./easing-workbench";

export default function EasingWorkbenchPage() {
  return (
    <main className="px-6 py-10 md:px-12 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Internal tool
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">Easing workbench</h1>
      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground/75">
        Calibrate easing curves, springs, durations, distances, and staggers
        before Phase 3 GSAP compositions. This tool stays in the lab. It is not
        part of the registry or client production bundles.
      </p>
      <section className="mt-12 border-t border-border pt-8">
        <EasingWorkbench />
      </section>
    </main>
  );
}
