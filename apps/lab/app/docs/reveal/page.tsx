import { RevealDemo } from "./reveal-demo";

export default function RevealDocsPage() {
  return (
    <main className="px-6 py-10 md:px-12 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Motion primitive
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">Reveal</h1>
      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground/75">
        Viewport entrance for catalogue and marketing leaves. Engine is Motion
        (`whileInView`). GSAP must not animate the same opacity or transform.
      </p>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Contract</h2>
        <dl className="mt-4 grid gap-3 font-mono text-sm">
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">as</dt>
            <dd>Element type. Default div.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">delay</dt>
            <dd>Seconds before the tween starts.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">once</dt>
            <dd>Play on first intersection only. Default true.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">y</dt>
            <dd>Translate distance in pixels. Default 16.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">intent</dt>
            <dd>Profile easing intent. Default enter.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">ease</dt>
            <dd>Raw cubic Bézier override. Optional escape hatch.</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
            <dt className="text-foreground/55">duration</dt>
            <dd>Seconds. Default profile duration.base (0.55).</dd>
          </div>
        </dl>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Reduced motion</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          MotionProvider sets MotionConfig to user. Reveal calls
          useReducedMotion and renders the static element when the user prefers
          reduced motion.
        </p>
      </section>

      <RevealDemo />
    </main>
  );
}
