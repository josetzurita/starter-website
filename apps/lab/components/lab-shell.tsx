import type { ReactNode } from "react";
import Link from "next/link";
import { ScrollTriggerProbe } from "./scroll-scene-hud";

const items = [
  { href: "/docs/reveal", label: "Reveal", kind: "motion" },
  { href: "/docs/stagger", label: "Stagger", kind: "motion" },
  { href: "/docs/text-reveal", label: "TextReveal", kind: "motion" },
  { href: "/docs/parallax", label: "Parallax", kind: "motion" },
  { href: "/docs/scroll-progress", label: "ScrollProgress", kind: "motion" },
  { href: "/docs/image-reveal", label: "ImageReveal", kind: "motion" },
  { href: "/docs/smooth-scroll", label: "SmoothScroll", kind: "scroll" },
  { href: "/docs/motion-language", label: "Motion language", kind: "language" },
  { href: "/tools/easing", label: "Easing workbench", kind: "tool" },
  { href: "/docs/sticky-stack", label: "StickyStack", kind: "scroll" },
  { href: "/docs/horizontal-gallery", label: "HorizontalGallery", kind: "scroll" },
  { href: "/docs/pinned-story", label: "PinnedStory", kind: "scroll" },
  { href: "/docs/project-config", label: "ProjectConfig", kind: "shell" },
  { href: "/docs/project-providers", label: "ProjectProviders", kind: "shell" },
  { href: "/docs/site-navigation", label: "Site navigation", kind: "shell" },
  { href: "/docs/responsive-media", label: "Responsive media", kind: "shell" },
  { href: "/docs/route-transitions", label: "Route transitions", kind: "shell" },
  { href: "/docs/pointer-accent", label: "PointerAccent", kind: "shell" },
  { href: "/styleguide", label: "Styleguide", kind: "shell" },
  { href: "/tools/project-builder", label: "Project builder", kind: "tool" },
];

export function LabShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] min-w-0 overflow-x-clip grid-cols-1 md:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="border-b border-border md:border-b-0 md:border-r">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.18em]">
            CDS Lab
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Catalogue">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-2 py-2 text-sm hover:bg-surface-muted"
            >
              <span className="block">{item.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/55">
                {item.kind}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <ScrollTriggerProbe />
        {children}
      </div>
    </div>
  );
}
