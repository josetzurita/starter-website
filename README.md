# Creative Development System

Phase 2.6 of a reusable kit for highly custom marketing and portfolio sites. The lab is a technical specimen catalogue, not a SaaS dashboard.

Read [AGENTS.md](AGENTS.md) before changing code.

## Architecture

pnpm workspaces plus Turborepo. Apps consume source packages through Next `transpilePackages`.

- `apps/lab` - Next.js App Router catalogue (`/`, `/docs/reveal`, Phase 2 motion docs, `/docs/smooth-scroll`, `/docs/motion-language`, `/tools/easing`)
- `apps/registry` - shadcn-compatible JSON at `/r/registry.json` and `/r/{name}.json`
- `packages/ui` - semantic tokens, restyled Button, restyled Dialog
- `packages/motion` - MotionProvider, MotionProfileProvider, SmoothScrollProvider, reduced-motion helpers, Reveal, Phase 2 primitives, Lenis plus GSAP ticker sync, CustomEase names
- `packages/core` - `cn`, Reveal contract, z-index scale
- `packages/core` - `cn`, Reveal contract, z-index scale
- `packages/eslint-config` and `packages/typescript-config` - shared tooling
- `examples/minimal-app` - fixture used to prove `shadcn add`

Internal lab code imports `@cds/motion`. The registry ships consumer copies of those primitives. Change the package first, then sync and rebuild registry JSON.

Sync: `apps/registry/scripts/sync-motion-registry.mjs` (canonical package to registry copies). Build: `apps/registry/scripts/build-registry.mjs`. `registry:build` runs both.

## Tokens

Semantic CSS variables only. No client brand palette lives in `@cds/ui`. The lab maps tokens to an instrument theme: graphite surfaces, tungsten accent, Geist plus Geist Mono.

Z-index scale (use `@cds/core` `zIndex`): base 0, raised 10, sticky 20, overlay 30, dialog 40, toast 50, debug 60.

## Motion

Motion is imported from `motion/react`. Reveal and Phase 2 primitives use opacity and transform only. Intent tokens (`enter`, `settle`, `move`, `exit`, `pop`, `linear`) live in a project-overridable motion profile. Lenis smooths document wheel scrolling on fine-pointer desktops. GSAP ticker drives Lenis (`autoRaf: false`). ScrollTrigger updates from Lenis scroll. Scrubbed timelines stay linear. Do not write large GSAP compositions in Phase 2.6. One engine owns each property. Honor `prefers-reduced-motion`. Magnetic is experimental and is not in the preferred interaction set.

Requires Node 20+ and pnpm 10. If `pnpm` is not on PATH, use `npx pnpm@10.15.0` for the same scripts.

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Dev:

```bash
pnpm --filter @cds/lab dev
pnpm --filter @cds/registry dev
```

Install a registry item from a built JSON file:

```bash
pnpm --filter @cds/registry registry:build
pnpm dlx shadcn@latest add ./apps/registry/public/r/reveal.json
pnpm dlx shadcn@latest add ./apps/registry/public/r/smooth-scroll.json
pnpm dlx shadcn@latest add ./apps/registry/public/r/motion-foundations.json
pnpm dlx shadcn@latest add ./apps/registry/public/r/motion-profile.json
```

Lab Playwright uses the installed Microsoft Edge channel (`channel: "msedge"`) so CI does not have to download Chrome for Testing.
