# AGENTS.md

Constraints for this creative-development system. Read this file before changing code. Phase 4 (Production Shell and Project Bootstrap) is authorized. Stop after Phase 4 unless a later phase is explicitly requested.

## Product

Internal component and interaction catalogue for creative developers. The lab is a technical specimen, not a generic SaaS dashboard.

Locked dials:

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 7`
- `VISUAL_DENSITY: 5`

## Workspace

pnpm + Turborepo. Package scope `@cds/*`.

| Path | Role |
| --- | --- |
| `apps/lab` | Next.js App Router catalogue |
| `apps/registry` | shadcn-compatible registry |
| `packages/ui` | Accessible UI primitives and semantic tokens |
| `packages/motion` | Motion, reduced-motion, Reveal, Phase 2 primitives, Lenis smooth scroll, GSAP infrastructure, Phase 3 ScrollTrigger compositions |
| `packages/core` | Contracts, `cn`, z-index scale |
| `packages/project` | Project config, ProjectProviders, navigation, route transitions, responsive media, SEO, site generator |
| `packages/eslint-config` | Shared ESLint |
| `packages/typescript-config` | Shared TypeScript |
| `examples/minimal-app` | Fixture for proving registry install |
| `templates/client-site` | Independent Next.js App Router starter copied by `pnpm create:site` |

Root scripts: `lint`, `typecheck`, `test`, `build`, `create:site`.

## TypeScript and React

- TypeScript strict mode. `noUncheckedIndexedAccess` is on. Do not enable `exactOptionalPropertyTypes` on UI packages; it fights Radix prop types.
- Server Components by default.
- Interactive code lives in isolated client leaves (`"use client"` at the top of that file only).
- Do not put Motion, GSAP, pointer physics, Lenis, or dialog state in Server Components.
- Providers that need browser APIs wrap children from a client leaf. Layouts stay Server Components.

## Styling

- Tailwind v4. CSS-first config. `@import "tailwindcss"` and `@tailwindcss/postcss`. No Tailwind v3 `tailwind.config` plugin.
- shadcn/ui pattern (owned source, Radix + CVA) with CSS-variable theming.
- Do not ship default shadcn styling (no New York radii, no Lucide, no generic `shadow-xs` chrome).
- Semantic design tokens only. No fixed client palette in `@cds/ui`. Lab may map tokens to an example instrument theme.
- One corner-radius scale: sharp-ish 4px / 6px / 8px (`--radius-sm|md|lg`).
- One icon family: Phosphor (`@phosphor-icons/react`). Do not mix icon sets. Standardize weight/stroke.
- Never `#000000` or `#ffffff`. Use off-black and off-white.
- One accent per theme. No AI-purple glow, no Inter as the default typeface.
- Visible copy must not use em-dashes (`—`) or en-dashes (`–`). Use a hyphen.

## Token names

Color: `--background`, `--foreground`, `--surface`, `--surface-muted`, `--border`, `--ring`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`.

Type: `--font-sans`, `--font-mono`.

Motion CSS: `--ease-out-expo`, `--duration-fast`, `--duration-base`.

Map tokens into Tailwind `@theme`. Apps must `@source` workspace packages so utilities in packages are scanned.

## Z-index scale

Use `@cds/core` `zIndex` and matching CSS variables. Do not invent `z-50` / `z-[123]`.

| Token | Value | Use |
| --- | --- | --- |
| `base` | 0 | Document flow |
| `raised` | 10 | Local elevation |
| `sticky` | 20 | Sticky chrome |
| `overlay` | 30 | Dialog/scrim overlay |
| `dialog` | 40 | Dialog content |
| `toast` | 50 | Toasts (later) |
| `debug` | 60 | Grain, debug overlays |

## Motion

- Import Motion from `motion/react` (`import { motion, MotionConfig, useReducedMotion } from "motion/react"`).
- Animate only `transform` and `opacity`. Do not animate `top`, `left`, `width`, or `height`.
- One animation engine owns each property on a node. Never let Motion and GSAP tween the same property.
- Motion owns UI state, layout, presence, in-view reveals (`Reveal`), and Phase 2 primitives (Stagger, TextReveal, Parallax, ScrollProgress, ImageReveal). Magnetic is experimental and is not part of the preferred interaction language.
- Lenis owns document wheel smoothing when SmoothScrollProvider is in smooth mode. Individual motion components must never instantiate Lenis. Exactly one Lenis instance per application.
- GSAP ticker is the only RAF source for Lenis (`autoRaf: false`). Convert ticker seconds to Lenis milliseconds (`time * 1000`). ScrollTrigger is notified from Lenis `scroll`. Do not add a second `requestAnimationFrame` loop.
- GSAP + ScrollTrigger own pin, scrub, and scroll hijack. Phase 2.5 registers plugins and ticker sync. Phase 2.6 registers semantic CustomEase names. Phase 3 owns StickyStack, HorizontalGallery, and PinnedStory only.
- No `window.addEventListener("scroll", ...)`. No `window.scrollY` in React state. Use Motion `useScroll`, Lenis, GSAP ScrollTrigger, IntersectionObserver, or CSS scroll-driven animation.
- Every animation must honor `prefers-reduced-motion`. Use `MotionConfig reducedMotion="user"`, `useReducedMotion`, and CSS `@media (prefers-reduced-motion: reduce)`.
- Infinite loops, parallax, magnetic physics, smooth scroll, and scroll hijack must collapse to static or native under reduced motion.
- GSAP in React must use `useGSAP` from `@gsap/react` or `gsap.context` with `ctx.revert()` on cleanup. Incomplete cleanup is a bug.
- Do not track continuous pointer or scroll values with `useState`. Use motion values.

## Motion language (Phase 2.6)

Canonical implementation: `packages/motion` profiles, `MotionProfileProvider`, and `useMotionProfile`.

- Standardize motion by intent: enter, settle, move, exit, pop, linear.
- House values live in `profiles/house.ts` and are overridable through `createMotionProfile`.
- Reveal, Stagger, and TextReveal default to enter. ImageReveal defaults to settle.
- Parallax and ScrollProgress stay scroll-driven. Do not ease scroll progress because a profile exists.
- Scrubbed ScrollTrigger timelines use `GSAP_SCROLL_SCRUB_EASE` (`none`). Register `cds-enter` and siblings without overwriting native GSAP names.
- Lenis lerp is scroll physics, not animation easing.
- Preserve raw `ease` and `duration` props as local overrides.
- The `/tools/easing` workbench is lab-only. Do not add it to registry output or client production bundles.

## Scroll storytelling (Phase 3)

Canonical implementation: `packages/motion` compositions plus internal `src/scroll/` helpers.

- Compositions: `StickyStack`, `HorizontalGallery`, `PinnedStory`. Do not add further scroll effects in this phase.
- Internal helpers standardize scoped GSAP lifecycle, `gsap.matchMedia`, Lenis compatibility, ScrollTrigger refresh, font and image readiness, route cleanup, reduced motion, development markers, and trigger disposal.
- Keep scroll helpers internal unless a composition requires a public export.
- Use the existing app-level Lenis instance. Never create another Lenis instance or a second RAF loop.
- Scrubbed animation uses `GSAP_SCROLL_SCRUB_EASE` (`none`). Motion profiles apply only to discrete transitions.
- Do not animate scroll-linked values through React state. Discrete active-index changes may use state.
- Do not expose the full ScrollTrigger config object as a prop.
- Do not add these items to `motion-foundations`. Bundle them as `scroll-storytelling`.

## Smooth scroll (Phase 2.5)

Canonical implementation: `packages/motion` `SmoothScrollProvider` and `useSmoothScroll`.

- Wire the lab through the existing client `Providers` component. The root layout stays a Server Component.
- Enable smooth wheel scrolling only on fine-pointer desktop devices.
- Touch defaults to native scrolling.
- Reduced motion defaults to native scrolling (do not run a Lenis instance).
- Preserve keyboard scrolling and browser accessibility.
- Conservative lerp `0.1`. Anchors enabled. Stop inertia on internal navigation.
- Nested and modal regions use `data-lenis-prevent`. Do not call `lenis.stop()` in a way that fights Radix body lock or focus trap.
- Route policy: do not add a pathname effect that resets hash navigation. Next.js owns default scroll restoration. In-page hashes go through Lenis `anchors`.
- Import Lenis CSS from `lenis/dist/lenis.css`.
- Use `ReactLenis` from `lenis/react`.

## Reveal and motion primitives

Canonical implementation: `packages/motion`. Engine: Motion for UI primitives. Registry items are consumer copies.

When a motion primitive, SmoothScrollProvider, Phase 3 scroll composition, or Phase 4 production-shell module changes:

1. Update `packages/motion` or `packages/project`.
2. Run `pnpm --filter @cds/registry registry:build` (syncs copies, then rebuilds JSON).
3. Do not treat `apps/registry/registry/default/*` as the source of truth.

Sync tooling: `apps/registry/scripts/sync-motion-registry.mjs` and `apps/registry/scripts/sync-project-registry.mjs` copy sources into the registry tree and strip `@cds/core`. `apps/registry/scripts/build-registry.mjs` inlines those files into `public/r/*.json`.

Do not implement Reveal or Phase 2 primitives with GSAP.

## Registry

- shadcn-compatible `registry.json` and item schema.
- Serve catalog at `/r/registry.json` and items at `/r/{name}.json`.
- Phase 1 item: `reveal`.
- Phase 2 items: `stagger`, `text-reveal`, `parallax`, `scroll-progress`, `image-reveal`.
- Experimental individual item: `magnetic` (not in `motion-foundations`, not in primary lab nav).
- Phase 2.5 item: `smooth-scroll`.
- Phase 2.6 item: `motion-profile`.
- Phase 3 items: `sticky-stack`, `horizontal-gallery`, `pinned-story`.
- Bundle `motion-foundations` installs Phase 2 primitives plus `smooth-scroll` and `motion-profile`, not Magnetic, not Pointer Accent, not the easing workbench, not Phase 3 scroll compositions.
- Bundle `scroll-storytelling` installs StickyStack, HorizontalGallery, and PinnedStory.
- Phase 4 items: `project-config`, `project-providers`, `site-navigation`, `responsive-media`, `seo-foundations`, `route-transitions`.
- Phase 4 optional item: `pointer-accent` (not in `motion-foundations`, not in `production-shell` as an auto-enabled effect).
- Bundle `production-shell` installs those Phase 4 items, not motion-foundations, not scroll-storytelling, not the Project Builder.
- Prove install with `scripts/prove-registry-install.mjs` against `examples/minimal-app`.

## Accessibility

- Radix primitives keep focus trap, keyboard, and `aria-*` behavior.
- Button text must meet WCAG AA against its background.
- Forms (when added) use label above input; never placeholder-as-label.

## Lab UI

The lab is a specimen catalogue: asymmetric index rail + main column, hairline separators that organize real content, Geist + Geist Mono, graphite + one tungsten accent. No three-equal feature cards, no dashboard metric widgets, no Lucide, no default shadcn theme.

Phase 1 lab routes: `/` and `/docs/reveal`. Button and Dialog are supporting primitives, not extra catalogue entries.

Phase 2 lab routes: `/docs/stagger`, `/docs/text-reveal`, `/docs/parallax`, `/docs/scroll-progress`, `/docs/image-reveal`. `/docs/magnetic` remains as an experimental route, not primary nav.

Phase 2.5 lab route: `/docs/smooth-scroll`.

Phase 2.6 lab routes: `/docs/motion-language` and `/tools/easing`.

Phase 3 lab routes: `/docs/sticky-stack`, `/docs/horizontal-gallery`, `/docs/pinned-story`.

Phase 4 lab routes: `/docs/project-config`, `/docs/project-providers`, `/docs/site-navigation`, `/docs/responsive-media`, `/docs/route-transitions`, `/docs/pointer-accent`, `/styleguide`, `/tools/project-builder`. The Project Builder is lab-only. `/styleguide` holds the Pointer Accent specimen.

## Production shell (Phase 4)

Canonical implementation: `packages/project`.

- Typed `ProjectConfig` covers identity, canonical URL, description, locale, theme mode, radius policy, motion profile, smooth-scroll enablement, page-transition enablement, analytics flag, CMS flag, and optional Pointer Accent.
- Validate configuration in development and production builds. Do not invent missing production values silently.
- `ProjectProviders` is the single client boundary composing MotionProvider, MotionProfileProvider, optional SmoothScrollProvider, optional RouteTransitionProvider, and optional PointerAccent. The root layout stays a Server Component. Features disable independently. Exactly one Lenis instance and one GSAP ticker integration.
- Pointer Accent is not a custom cursor. The native operating-system cursor must always remain visible. Never `cursor: none`. Canonical implementation: `packages/motion/src/pointer-accent.tsx`. GSAP `quickTo` owns x, y, rotation, scaleX, scaleY, and opacity. Disable on touch, coarse pointers, and reduced motion. Magnetic effects remain prohibited.
- Structural navigation: SkipLink, MainContent, SiteHeader, DesktopNavigation, MobileNavigation, NavigationToggle, TransitionLink. Keyboard accessible. Escape closes mobile navigation. No fixed client styles, logo treatment, or magnetic effects. Scrollable overlays use `data-lenis-prevent`.
- Route transitions: `none` or `overlay`. The controller owns navigation state and timing. The project owns overlay visuals through a render prop. Do not intercept anchors globally. Recover if navigation fails. Honor reduced motion.
- Responsive media stays unopinionated: intrinsic dimensions, sizes, priority/lazy, poster, autoplay safety, reduced-motion video, error fallback. No fixed aspect, radius, or chrome.
- SEO helpers read production identity from project configuration only.
- Generator: `pnpm create:site client-name --preset minimal|creative|storytelling`. Validate the name, refuse a non-empty destination, copy `templates/client-site`, rewrite metadata, install registry items for the preset, optionally install dependencies and typecheck. Use process argument arrays, never string-concatenated shells.

Preset installs:

- `minimal`: production-shell
- `creative`: production-shell plus motion-foundations plus pointer-accent
- `storytelling`: creative plus scroll-storytelling

Pointer Accent installs on creative and storytelling presets. It stays disabled until `pointerAccent.enabled` is true. Minimal projects must not turn it on by default.

## Testing and quality

Before finishing a phase: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Report failures honestly.

## Out of scope (later)

Marquees, extra shadcn components, marketing sites, Figma, additional icon families, Three.js, custom cursors (replacing or hiding the native cursor), video scrubbing, CMS schemas, analytics vendors, WebGL, decorative preloaders, additional branded transitions. Pointer Accent is allowed as a supplement to the native cursor.
