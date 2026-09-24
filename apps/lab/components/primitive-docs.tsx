import type { ReactNode } from "react";

type ContractRow = {
  name: string;
  detail: string;
};

export function PrimitiveDocs({
  title,
  intro,
  contract,
  recommended,
  avoid,
  ownership,
  reducedMotion,
  mobile,
  performance,
  install,
  usage,
  specimen,
  failures,
  eyebrow = "Motion primitive",
}: {
  title: string;
  intro: string;
  contract: ContractRow[];
  recommended: string;
  avoid: string;
  ownership: string;
  reducedMotion: string;
  mobile: string;
  performance: string;
  install: string;
  usage: string;
  specimen: ReactNode;
  failures?: string;
  eyebrow?: string;
}) {
  return (
    <main className="px-6 py-10 md:px-12 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">{title}</h1>
      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground/75">
        {intro}
      </p>

      <section className="mt-12 border-t border-border pt-8">{specimen}</section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">API contract</h2>
        <dl className="mt-4 grid gap-3 font-mono text-sm">
          {contract.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[9rem_minmax(0,1fr)] gap-4"
            >
              <dt className="text-foreground/55">{row.name}</dt>
              <dd>{row.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Recommended use</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          {recommended}
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Avoid when</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          {avoid}
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Engine and property ownership</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          {ownership}
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Reduced motion</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          {reducedMotion}
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Mobile</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          {mobile}
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Performance</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          {performance}
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Installation</h2>
        <pre className="mt-3 overflow-x-auto border border-border bg-surface-muted p-4 font-mono text-xs">
          <code>{install}</code>
        </pre>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-medium">Usage example</h2>
        <pre className="mt-3 overflow-x-auto border border-border bg-surface-muted p-4 font-mono text-xs">
          <code>{usage}</code>
        </pre>
      </section>

      {failures ? (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-medium">Known failure modes</h2>
          <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
            {failures}
          </p>
        </section>
      ) : null}
    </main>
  );
}
