import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const registryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const motionSrc = path.resolve(registryRoot, "../../packages/motion/src");

const LOCAL_CN = `function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}`;

const REVEAL_PROPS = `export type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
  y?: number;
  intent?: "enter" | "settle" | "move" | "exit" | "linear";
  ease?: readonly [number, number, number, number];
  duration?: number;
};`;

const PROFILE_FILES = [
  { from: "resolve-tween.ts", to: "resolve-tween.ts" },
  { from: "use-motion-profile.ts", to: "use-motion-profile.ts" },
  { from: "profiles/types.ts", to: "profiles/types.ts" },
  { from: "profiles/create-motion-profile.ts", to: "profiles/create-motion-profile.ts" },
  { from: "profiles/house.ts", to: "profiles/house.ts" },
];

const SCROLL_INFRA = [
  { from: "scroll/use-scroll-scene.ts", to: "scroll/use-scroll-scene.ts" },
  { from: "scroll/use-scroll-refresh.ts", to: "scroll/use-scroll-refresh.ts" },
  { from: "scroll/scroll-breakpoints.ts", to: "scroll/scroll-breakpoints.ts" },
  { from: "scroll/scroll-debug.ts", to: "scroll/scroll-debug.ts" },
  { from: "scroll/scroll-types.ts", to: "scroll/scroll-types.ts" },
  { from: "scroll/scroll-options.ts", to: "scroll/scroll-options.ts" },
  { from: "gsap.ts", to: "gsap.ts" },
  { from: "use-scoped-gsap.ts", to: "use-scoped-gsap.ts" },
  { from: "clamp.ts", to: "clamp.ts" },
  { from: "motion-policy.ts", to: "motion-policy.ts" },
];

function normalizeSource(source) {
  return source.replaceAll("\r\n", "\n").replaceAll("\r", "\n").replace(/\n{3,}/g, "\n\n");
}

function splitImportBlock(source) {
  const useClient = source.startsWith('"use client";\n') ? '"use client";\n' : "";
  let rest = useClient ? source.slice(useClient.length) : source;
  rest = rest.replace(/^\n+/, "");

  const importBlock = /^(?:import(?:[\s\S]*?)from\s+["'][^"']+["'];\n)+/;
  const match = rest.match(importBlock);
  if (!match) {
    return { prefix: useClient, imports: "", body: rest };
  }

  return {
    prefix: useClient,
    imports: match[0],
    body: rest.slice(match[0].length).replace(/^\n+/, ""),
  };
}

function stripCore(source, { isReveal = false } = {}) {
  let next = normalizeSource(source)
    .replace(/import \{ cn \} from ["']@cds\/core["'];\n*/g, "")
    .replace(/import type \{ RevealProps \} from ["']@cds\/core["'];\n*/g, "");

  if (isReveal) {
    next = next.replace(
      /import \{ createElement, type ElementType \} from "react";/,
      `import { createElement, type ElementType, type ReactNode } from "react";`,
    );
  }

  const { prefix, imports, body } = splitImportBlock(next);
  const extras = [];

  if (isReveal && !body.includes("export type RevealProps") && !imports.includes("export type RevealProps")) {
    extras.push(REVEAL_PROPS);
  }

  if (next.includes("cn(") && !next.includes("function cn(")) {
    extras.push(LOCAL_CN);
  }

  const extraBlock = extras.length ? `${extras.join("\n\n")}\n\n` : "";
  const importBlock = imports ? `${imports}\n` : "";
  const client = prefix ? `${prefix}\n` : "";

  return `${client}${importBlock}${extraBlock}${body}`;
}

const items = [
  {
    name: "reveal",
    files: [
      { from: "reveal.tsx", to: "reveal.tsx", isReveal: true },
      ...PROFILE_FILES,
    ],
  },
  {
    name: "stagger",
    files: [
      { from: "stagger.tsx", to: "stagger.tsx" },
      { from: "clamp.ts", to: "clamp.ts" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
      ...PROFILE_FILES,
    ],
  },
  {
    name: "text-reveal",
    files: [
      { from: "text-reveal.tsx", to: "text-reveal.tsx" },
      { from: "clamp.ts", to: "clamp.ts" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
      { from: "text-split.ts", to: "text-split.ts" },
      ...PROFILE_FILES,
    ],
  },
  {
    name: "parallax",
    files: [
      { from: "parallax.tsx", to: "parallax.tsx" },
      { from: "clamp.ts", to: "clamp.ts" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
    ],
  },
  {
    name: "magnetic",
    files: [
      { from: "magnetic.tsx", to: "magnetic.tsx" },
      { from: "clamp.ts", to: "clamp.ts" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
    ],
  },
  {
    name: "scroll-progress",
    files: [
      { from: "scroll-progress.tsx", to: "scroll-progress.tsx" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
    ],
  },
  {
    name: "image-reveal",
    files: [
      { from: "image-reveal.tsx", to: "image-reveal.tsx" },
      { from: "clamp.ts", to: "clamp.ts" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
      ...PROFILE_FILES,
    ],
  },
  {
    name: "smooth-scroll",
    files: [
      { from: "smooth-scroll-provider.tsx", to: "smooth-scroll-provider.tsx" },
      { from: "use-smooth-scroll.ts", to: "use-smooth-scroll.ts" },
      { from: "smooth-scroll-options.ts", to: "smooth-scroll-options.ts" },
      { from: "smooth-scroll-sync.ts", to: "smooth-scroll-sync.ts" },
      { from: "gsap.ts", to: "gsap.ts" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
      { from: "reduced-motion.ts", to: "reduced-motion.ts" },
    ],
  },
  {
    name: "motion-profile",
    files: [
      { from: "motion-profile-provider.tsx", to: "motion-profile-provider.tsx" },
      { from: "use-motion-profile.ts", to: "use-motion-profile.ts" },
      { from: "register-motion-eases.ts", to: "register-motion-eases.ts" },
      { from: "export-motion-profile.ts", to: "export-motion-profile.ts" },
      { from: "gsap-ease-names.ts", to: "gsap-ease-names.ts" },
      { from: "resolve-tween.ts", to: "resolve-tween.ts" },
      { from: "profiles/types.ts", to: "profiles/types.ts" },
      { from: "profiles/house.ts", to: "profiles/house.ts" },
      { from: "profiles/create-motion-profile.ts", to: "profiles/create-motion-profile.ts" },
    ],
  },
  {
    name: "sticky-stack",
    files: [{ from: "sticky-stack.tsx", to: "sticky-stack.tsx" }, ...SCROLL_INFRA],
  },
  {
    name: "horizontal-gallery",
    files: [
      { from: "horizontal-gallery.tsx", to: "horizontal-gallery.tsx" },
      ...SCROLL_INFRA,
    ],
  },
  {
    name: "pinned-story",
    files: [{ from: "pinned-story.tsx", to: "pinned-story.tsx" }, ...SCROLL_INFRA],
  },
  {
    name: "pointer-accent",
    files: [
      { from: "pointer-accent.tsx", to: "pointer-accent.tsx" },
      { from: "pointer-accent-options.ts", to: "pointer-accent-options.ts" },
      { from: "clamp.ts", to: "clamp.ts" },
      { from: "motion-policy.ts", to: "motion-policy.ts" },
      { from: "gsap.ts", to: "gsap.ts" },
      { from: "gsap-ease-names.ts", to: "gsap-ease-names.ts" },
      { from: "use-motion-profile.ts", to: "use-motion-profile.ts" },
      { from: "resolve-tween.ts", to: "resolve-tween.ts" },
      ...PROFILE_FILES,
    ],
  },
];

async function main() {
  for (const item of items) {
    const destDir = path.join(registryRoot, "registry", "default", item.name);
    await mkdir(destDir, { recursive: true });
    for (const file of item.files) {
      const source = await readFile(path.join(motionSrc, file.from), "utf8");
      const transformed = file.from.endsWith(".tsx")
        ? stripCore(source, { isReveal: Boolean(file.isReveal) })
        : normalizeSource(source);
      const dest = path.join(destDir, file.to);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, transformed.endsWith("\n") ? transformed : `${transformed}\n`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
