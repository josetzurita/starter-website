"use client";

import { MediaFrame, ResponsiveImage, SkipLink } from "@cds/project";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cds/ui";
import Link from "next/link";
import { StyleguideSection } from "./styleguide-section";

export function ComponentSection() {
  return (
    <StyleguideSection
      description="Live Lab primitives only. Button and Dialog from @cds/ui. Media and skip link from @cds/project. Catalogue links stay Next.js Link."
      id="components"
      title="Components"
    >
      <div className="space-y-12">
        <div>
          <h3 className="type-h4">Button</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>

        <div>
          <h3 className="type-h4">Dialog</h3>
          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Specimen dialog</DialogTitle>
                  <DialogDescription>
                    Focus stays trapped. Escape and the close control dismiss it.
                    Overlay regions should keep data-lenis-prevent when they scroll.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <h3 className="type-h4">Catalogue links</h3>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link className="underline underline-offset-4" href="/docs/reveal">
              Reveal
            </Link>
            <Link className="underline underline-offset-4" href="/docs/pointer-accent">
              PointerAccent
            </Link>
            <Link className="underline underline-offset-4" href="/styleguide">
              Styleguide
            </Link>
          </div>
        </div>

        <div>
          <h3 className="type-h4">Skip link</h3>
          <p className="mt-2 max-w-[60ch] text-sm text-foreground/75">
            The production skip link sits at the document top and appears on focus.
            This copy is a visible specimen of the same component.
          </p>
          <div className="relative mt-4 h-14 border border-border bg-surface">
            <SkipLink className="not-sr-only static m-3 inline-flex" />
          </div>
        </div>

        <div>
          <h3 className="type-h4">Responsive image</h3>
          <div className="mt-4 max-w-xs">
            <ResponsiveImage
              alt="Lab specimen graphic for the styleguide media chapter"
              height={180}
              sizes="(min-width: 768px) 420px, 100vw"
              src="/specimen.svg"
              width={420}
            />
          </div>
        </div>

        <div>
          <h3 className="type-h4">Media frame</h3>
          <MediaFrame className="mt-4 max-w-md border border-border bg-surface-muted">
            <ResponsiveImage
              alt="Wide specimen field inside a media frame"
              className="w-full"
              height={180}
              sizes="(min-width: 768px) 28rem, 100vw"
              src="/specimen.svg"
              width={1280}
            />
          </MediaFrame>
        </div>
      </div>
    </StyleguideSection>
  );
}
