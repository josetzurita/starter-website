"use client";

import { ScrollProgress } from "@cds/motion";

export function ScrollProgressDemo() {
  return (
    <div data-testid="scroll-progress-live">
      <ScrollProgress />
      <div className="h-[120vh] border-t border-border pt-6">
        <p className="max-w-[60ch] text-sm leading-relaxed text-foreground/75">
          Page progress scales this bar. Scroll the document. Container scope is
          experimental and is not used in this specimen.
        </p>
      </div>
    </div>
  );
}
