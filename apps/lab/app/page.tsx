import Link from "next/link";

const routes = [
  { href: "/docs/reveal", label: "Reveal" },
  { href: "/docs/stagger", label: "Stagger" },
  { href: "/docs/text-reveal", label: "TextReveal" },
  { href: "/docs/parallax", label: "Parallax" },
  { href: "/docs/scroll-progress", label: "ScrollProgress" },
  { href: "/docs/image-reveal", label: "ImageReveal" },
  { href: "/docs/smooth-scroll", label: "SmoothScroll" },
  { href: "/docs/motion-language", label: "Motion language" },
  { href: "/tools/easing", label: "Easing workbench" },
  { href: "/docs/sticky-stack", label: "StickyStack" },
  { href: "/docs/horizontal-gallery", label: "HorizontalGallery" },
  { href: "/docs/pinned-story", label: "PinnedStory" },
  { href: "/docs/project-config", label: "ProjectConfig" },
  { href: "/docs/project-providers", label: "ProjectProviders" },
  { href: "/docs/site-navigation", label: "Site navigation" },
  { href: "/docs/responsive-media", label: "Responsive media" },
  { href: "/docs/route-transitions", label: "Route transitions" },
  { href: "/docs/pointer-accent", label: "PointerAccent" },
  { href: "/styleguide", label: "Styleguide" },
  { href: "/tools/project-builder", label: "Project builder" },
];

export default function HomePage() {
  return (
    <main className="px-6 py-10 md:px-12 md:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Phase 4 catalogue
      </p>
      <h1 className="mt-4 max-w-[18ch] text-4xl font-medium tracking-tight md:text-5xl">
        Interaction specimens, not a product shell.
      </h1>
      <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-foreground/75">
        Tokens, restyled primitives, motion profiles, Lenis, three GSAP
        scroll compositions, a production shell, and an optional pointer
        accent that never replaces the system cursor. The easing workbench and
        Project Builder are lab-only. Magnetic is experimental and is not
        listed here.
      </p>
      <ul className="mt-10 grid gap-2">
        {routes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-border px-4 text-sm hover:bg-surface-muted"
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
