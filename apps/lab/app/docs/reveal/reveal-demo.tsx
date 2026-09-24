"use client";

import { Reveal } from "@cds/motion";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cds/ui";

export function RevealDemo() {
  return (
    <div className="mt-12 grid gap-10">
      <div data-testid="reveal-live" className="grid gap-4">
        <Reveal>
          <article className="border-t border-border pt-4">
            <h2 className="text-xl tracking-tight">In-view entrance</h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-foreground/75">
              Opacity and translateY only. Motion owns this node. Reduced motion
              skips the tween and renders the content immediately.
            </p>
          </article>
        </Reveal>
        <Reveal delay={0.08}>
          <article className="border-t border-border pt-4">
            <h2 className="text-xl tracking-tight">Staggered sibling</h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-foreground/75">
              Delay is a prop. Do not add a second engine on transform or
              opacity.
            </p>
          </article>
        </Reveal>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Open specimen dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal inside Dialog</DialogTitle>
            <DialogDescription>
              Dialog overlay uses z-overlay. Content uses z-dialog. Presence is
              Radix. Do not also tween these layers with GSAP.
            </DialogDescription>
          </DialogHeader>
          <Reveal delay={0.05} className="mt-4">
            <p className="text-sm leading-relaxed" data-testid="dialog-reveal">
              Nested reveal still honors prefers-reduced-motion through
              MotionConfig.
            </p>
          </Reveal>
        </DialogContent>
      </Dialog>
    </div>
  );
}
