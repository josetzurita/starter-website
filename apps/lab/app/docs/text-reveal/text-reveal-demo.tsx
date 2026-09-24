"use client";

import { TextReveal } from "@cds/motion";

const sample = "One accessible string. Fragments stay hidden from assistive technology.";

export function TextRevealDemo() {
  return (
    <div data-testid="text-reveal-live">
      <TextReveal text={sample} />
    </div>
  );
}
