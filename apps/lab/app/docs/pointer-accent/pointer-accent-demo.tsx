"use client";

import { PointerAccent } from "@cds/motion";
import { Button } from "@cds/ui";

export function PointerAccentDemo() {
  return (
    <div id="pointer-accent-live" data-testid="pointer-accent-live" className="relative space-y-6">
      <PointerAccent
        enabled
        size={14}
        color="oklch(0.97 0.004 250)"
        opacity={1}
        shape="circle"
        lag={0.4}
        ease="power3.out"
        stretch={0.2}
        maxStretch={0.6}
        blendMode="difference"
        zIndex="debug"
        hoverGrow
        hoverScaleMax={1.5}
      />
      <p
        data-pointer-accent-text=""
        className="max-w-[18ch] text-4xl font-medium tracking-tight md:text-5xl"
      >
        Invert this line.
      </p>
      <p className="max-w-[48ch] text-sm leading-relaxed text-foreground/75">
        Move the system cursor across this specimen. The native pointer stays
        visible. Hover the headline, the link, or the button so the disc covers
        the target and difference-blend inverts the type.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <a href="#pointer-accent-live" className="text-sm underline underline-offset-4">
          Specimen link
        </a>
        <Button type="button">Still clickable</Button>
      </div>
    </div>
  );
}
