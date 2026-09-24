import type { ReactNode } from "react";

export function StyleguideSection({
  id,
  title,
  description,
  headingLevel = "h2",
  children,
}: {
  id: string;
  title: string;
  description?: string;
  headingLevel?: "h1" | "h2";
  children: ReactNode;
}) {
  const Heading = headingLevel;

  return (
    <section className="scroll-mt-20 border-t border-border py-16" id={id}>
      <Heading className={headingLevel === "h1" ? "type-h1 max-w-[22ch]" : "type-h2 max-w-[22ch]"}>
        {title}
      </Heading>
      {description ? (
        <p className="type-body mt-4 max-w-[65ch] text-foreground/75">{description}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}
