"use client";

import { ImageReveal } from "@cds/motion";
import Image from "next/image";

export function ImageRevealDemo() {
  return (
    <div data-testid="image-reveal-live" className="max-w-md">
      <ImageReveal direction="up" scale={1.04}>
        <Image
          alt="Graphite specimen field"
          src="/specimen.svg"
          width={640}
          height={360}
          className="block h-auto w-full"
        />
      </ImageReveal>
    </div>
  );
}
