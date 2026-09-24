import { ProjectBuilder } from "./project-builder";

export default function ProjectBuilderPage() {
  return (
    <main className="px-6 py-10 md:px-12 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Lab tool
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">Project builder</h1>
      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground/75">
        Preview a create:site preset. This tool is lab-only and is not part of
        registry output or client production bundles.
      </p>
      <section className="mt-12 border-t border-border pt-8">
        <ProjectBuilder />
      </section>
    </main>
  );
}
