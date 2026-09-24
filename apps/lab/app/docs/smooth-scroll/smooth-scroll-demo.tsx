"use client";

import { useSmoothScroll } from "@cds/motion";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cds/ui";

export function SmoothScrollDemo() {
  const { mode, scrollTo } = useSmoothScroll();

  return (
    <div data-testid="smooth-scroll-live" className="grid gap-10">
      <p className="font-mono text-sm" data-testid="smooth-scroll-mode">
        Active mode: {mode}
      </p>

      <nav className="flex flex-wrap gap-3" aria-label="In-page anchors">
        <a
          className="border border-border px-3 py-2 text-sm"
          href="#nested-scroll"
        >
          Nested region
        </a>
        <button
          type="button"
          className="border border-border px-3 py-2 text-sm"
          onClick={() => {
            scrollTo("#dialog-anchor");
          }}
        >
          Dialog specimen
        </button>
      </nav>

      <section className="min-h-[80vh] border-t border-border pt-8">
        <h2 className="text-lg font-medium">Document scroll</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Wheel smoothing runs only in smooth mode. Keyboard Page Down and
          arrows still move the document. This block is tall so you can evaluate
          the controller, not a composed portfolio section.
        </p>
      </section>

      <section
        id="nested-scroll"
        className="min-h-[80vh] border-t border-border pt-8"
      >
        <h2 className="text-lg font-medium">Nested scroll</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          The box uses data-lenis-prevent so wheel events stay native inside it.
        </p>
        <div
          data-testid="smooth-scroll-nested"
          data-lenis-prevent
          className="mt-4 h-40 overflow-y-auto border border-border p-3 text-sm"
        >
          {Array.from({ length: 24 }, (_, index) => (
            <p key={index} className="py-2">
              Nested line {index + 1}. Document Lenis must not consume this
              wheel.
            </p>
          ))}
        </div>
      </section>

      <section
        id="dialog-anchor"
        className="min-h-[80vh] border-t border-border pt-8"
      >
        <h2 className="text-lg font-medium">Dialog overlay</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Overflowing dialog content is marked data-lenis-prevent. Radix keeps
          focus lock. Lenis is not stopped globally, so body lock and the
          ticker do not fight.
        </p>
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open overflowing dialog</Button>
            </DialogTrigger>
            <DialogContent
              data-lenis-prevent
              className="max-h-[40vh] overflow-y-auto"
            >
              <DialogHeader>
                <DialogTitle>Scrollable dialog</DialogTitle>
                <DialogDescription>
                  Wheel this panel independently of the document.
                </DialogDescription>
              </DialogHeader>
              <div data-testid="smooth-scroll-dialog">
                {Array.from({ length: 20 }, (_, index) => (
                  <p key={index} className="py-2 text-sm">
                    Dialog line {index + 1}.
                  </p>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
