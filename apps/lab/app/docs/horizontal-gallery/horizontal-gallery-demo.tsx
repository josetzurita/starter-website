"use client";

import {
  countScrollTriggers,
  HorizontalGallery,
  HorizontalGalleryItem,
} from "@cds/motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ScrollSceneHud } from "../../../components/scroll-scene-hud";

const frames = [
  {
    id: "01",
    title: "Scroll the document",
    copy: "This section is viewport tall. Keep scrolling vertically. When the top of the gallery hits the top of the viewport, the wrapper pins and the track moves sideways.",
  },
  {
    id: "02",
    title: "Measured travel",
    copy: "Horizontal distance is track width minus the wrapper width. Late images change that distance and the scene refreshes.",
  },
  {
    id: "03",
    title: "Not a carousel",
    copy: "Wheel, keys, and the document scroller drive this. There is no separate horizontal page scroll.",
  },
  {
    id: "04",
    title: "Project-owned frames",
    copy: "Item width, type, and media stay with the project. The primitive only pins and translates.",
  },
  {
    id: "05",
    title: "Release",
    copy: "When travel is spent, the pin ends and the following section can take the viewport.",
  },
];

export function HorizontalGalleryDemo() {
  const [debug, setDebug] = useState(false);
  const [count, setCount] = useState(0);
  const [travel, setTravel] = useState("0");
  const [mode, setMode] = useState("pin");
  const [showMedia, setShowMedia] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount(countScrollTriggers("cds-horizontal-gallery"));
      const root = document.querySelector("[data-horizontal-gallery]");
      setTravel(root?.getAttribute("data-horizontal-travel") ?? "0");
      setMode(root?.getAttribute("data-scroll-mode") ?? "pin");
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div data-testid="horizontal-gallery-live" className="grid gap-8">
      <ScrollSceneHud
        triggerCount={count}
        debug={debug}
        onDebugChange={setDebug}
        extra={`mode ${mode} / travel ${travel}px`}
      />

      <p className="max-w-[65ch] text-sm leading-relaxed text-foreground/75">
        Vertical scroll drives horizontal travel. The frames will not move until
        this section pins at the top of the viewport. Below 768px the track
        swipes natively. Reduced motion stacks the frames.
      </p>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showMedia}
          onChange={(event) => setShowMedia(event.target.checked)}
          data-testid="gallery-media-toggle"
        />
        Include measured media
      </label>

      <a className="text-sm underline" href="#horizontal-gallery-after">
        After the gallery
      </a>

      <HorizontalGallery debug={debug} className="min-h-[100dvh]">
        {frames.map((frame, index) => (
          <HorizontalGalleryItem
            key={frame.id}
            className="flex min-h-[100dvh] w-[min(92vw,72rem)] shrink-0 flex-col justify-start border-r border-border bg-surface px-8 py-16"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
              Frame {frame.id}
            </p>
            <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-tight">
              {frame.title}
            </h2>
            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-foreground/75">
              {frame.copy}
            </p>
            <a
              className="mt-6 inline-block w-fit text-sm underline"
              href="#horizontal-gallery-after"
            >
              Skip to after
            </a>
            {showMedia && index === 1 ? (
              <Image
                alt="Wide gallery specimen"
                src="/specimen.svg"
                width={720}
                height={240}
                data-testid="gallery-media"
                className="mt-8 h-auto w-full max-w-[36rem]"
              />
            ) : null}
          </HorizontalGalleryItem>
        ))}
      </HorizontalGallery>

      <section
        id="horizontal-gallery-after"
        data-testid="horizontal-gallery-after"
        className="min-h-[40vh] border-t border-border pt-8"
      >
        <h2 className="text-lg font-medium">After</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-foreground/75">
          Horizontal travel must not widen the document. This copy is reachable
          after the pin releases.
        </p>
      </section>
    </div>
  );
}
