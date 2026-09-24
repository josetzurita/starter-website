"use client";

import { Parallax } from "@cds/motion";

export function ParallaxDemo() {
  return (
    <div data-testid="parallax-live" className="overflow-x-hidden">
      <Parallax speed={0.2} disableBelow={640} className="border-t border-border pt-6">
        <p className="max-w-[60ch] text-sm leading-relaxed text-foreground/75">
          This wrapper translates on the y axis with a clamped speed. Motion owns
          transform here. Nested copy is static.
        </p>
      </Parallax>
    </div>
  );
}
