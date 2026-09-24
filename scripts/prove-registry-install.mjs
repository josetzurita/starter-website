import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let dest = path.join(root, ".registry-proof");
const destFallback = path.join(root, ".registry-proof-work");
const builtDir = path.join(root, "apps", "registry", "public", "r");

const items = [
  { name: "reveal", file: "reveal.tsx", markers: ["useReducedMotion", "motion/react", "useMotionProfile"] },
  { name: "stagger", file: "stagger.tsx", markers: ["useReducedMotion", "motion/react", "useMotionProfile"] },
  { name: "text-reveal", file: "text-reveal.tsx", markers: ["useReducedMotion", "motion/react", "useMotionProfile"] },
  { name: "parallax", file: "parallax.tsx", markers: ["useReducedMotion", "motion/react"] },
  { name: "magnetic", file: "magnetic.tsx", markers: ["useReducedMotion", "motion/react"] },
  { name: "scroll-progress", file: "scroll-progress.tsx", markers: ["useReducedMotion", "motion/react"] },
  { name: "image-reveal", file: "image-reveal.tsx", markers: ["useReducedMotion", "motion/react", "useMotionProfile"] },
  { name: "smooth-scroll", file: "smooth-scroll-provider.tsx", markers: ["ReactLenis", "attachGsapLenisSync"] },
  { name: "motion-profile", file: "motion-profile-provider.tsx", markers: ["createMotionProfile", "registerMotionEases"] },
  { name: "sticky-stack", file: "sticky-stack.tsx", markers: ["ScrollTrigger", "useScrollScene"] },
  { name: "horizontal-gallery", file: "horizontal-gallery.tsx", markers: ["horizontalTravel", "invalidateOnRefresh"] },
  { name: "pinned-story", file: "pinned-story.tsx", markers: ["frameProgress", "renderVisual"] },
  { name: "project-config", file: "project-config.ts", markers: ["ProjectConfigError", "canonicalUrl"] },
  { name: "project-providers", file: "project-providers.tsx", markers: ["MotionProvider", "SmoothScrollProvider"] },
  { name: "site-navigation", file: "site-header.tsx", markers: ["DesktopNavigation", "MobileNavigation"] },
  { name: "responsive-media", file: "responsive-image.tsx", markers: ["sizes", "fallback"] },
  { name: "seo-foundations", file: "seo.ts", markers: ["createMetadata", "jsonLdWebSite"] },
  { name: "route-transitions", file: "route-transition-provider.tsx", markers: ["ROUTE_TRANSITION_TIMEOUT_MS", "fail"] },
  { name: "pointer-accent", file: "pointer-accent.tsx", markers: ["quickTo", "pointer-events", "killTweensOf"] },
];

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function pnpmBin() {
  const check = spawnSync("pnpm", ["--version"], { shell: true, encoding: "utf8" });
  if (check.status === 0) {
    return ["pnpm"];
  }
  return ["npx", "--yes", "pnpm@10.15.0"];
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

function assertInstalled(name, fileName, markers) {
  const files = walk(dest);
  const match = files.find((file) =>
    file.replaceAll("\\", "/").endsWith(`/${fileName}`),
  );
  if (!match) {
    throw new Error(`${name} was not installed into the minimal app.`);
  }
  const source = readFileSync(match, "utf8");
  for (const marker of markers) {
    if (!source.includes(marker)) {
      throw new Error(`Installed ${name} is missing ${marker}.`);
    }
  }
  return match;
}

mkdirSync(builtDir, { recursive: true });
run("node", [path.join("apps", "registry", "scripts", "sync-motion-registry.mjs")], root);
run("node", [path.join("apps", "registry", "scripts", "sync-project-registry.mjs")], root);
run("node", [path.join("apps", "registry", "scripts", "build-registry.mjs")], root);

for (const item of [...items, { name: "motion-foundations" }, { name: "scroll-storytelling" }, { name: "production-shell" }]) {
  const jsonPath = path.join(builtDir, `${item.name}.json`);
  if (!existsSync(jsonPath)) {
    throw new Error(`Missing built registry item at ${jsonPath}`);
  }
  const source = readFileSync(jsonPath, "utf8");
  if (
    source.includes("easing-workbench") ||
    source.includes("/tools/easing") ||
    source.includes("EasingWorkbench")
  ) {
    throw new Error(`${item.name}.json must not include the easing workbench.`);
  }
}

try {
  rmSync(dest, { recursive: true, force: true });
} catch {
  dest = destFallback;
  rmSync(dest, { recursive: true, force: true });
}

cpSync(path.join(root, "examples", "minimal-app"), dest, {
  recursive: true,
  filter: (src) => {
    const normalized = src.replaceAll("\\", "/");
    return !normalized.includes("/node_modules") && !normalized.includes("/.next");
  },
});

const pnpm = pnpmBin();
run(pnpm[0], [...pnpm.slice(1), "install", "--ignore-workspace"], dest);

const foundations = readFileSync(path.join(builtDir, "motion-foundations.json"), "utf8");
if (
  foundations.includes("StickyStack") ||
  foundations.includes("HorizontalGallery") ||
  foundations.includes("PinnedStory") ||
  foundations.includes("sticky-stack.tsx") ||
  foundations.includes("PointerAccent") ||
  foundations.includes("pointer-accent.tsx")
) {
  throw new Error("motion-foundations must not include Phase 3 scroll compositions or Pointer Accent.");
}

for (const item of items) {
  const jsonName = `${item.name}.json`;
  cpSync(path.join(builtDir, jsonName), path.join(dest, jsonName));
  run(
    pnpm[0],
    [...pnpm.slice(1), "dlx", "shadcn@latest", "add", `./${jsonName}`, "--yes", "--overwrite"],
    dest,
  );
  const installed = assertInstalled(item.name, item.file, item.markers);
  console.log(`Registry install proof passed: ${path.relative(root, installed)}`);
}

cpSync(path.join(builtDir, "motion-foundations.json"), path.join(dest, "motion-foundations.json"));
run(
  pnpm[0],
  [...pnpm.slice(1), "dlx", "shadcn@latest", "add", "./motion-foundations.json", "--yes", "--overwrite"],
  dest,
);

for (const item of items.filter(
  (entry) =>
    entry.name !== "reveal" &&
    entry.name !== "magnetic" &&
    entry.name !== "sticky-stack" &&
    entry.name !== "horizontal-gallery" &&
    entry.name !== "pinned-story" &&
    entry.name !== "project-config" &&
    entry.name !== "project-providers" &&
    entry.name !== "site-navigation" &&
    entry.name !== "responsive-media" &&
    entry.name !== "seo-foundations" &&
    entry.name !== "route-transitions" &&
    entry.name !== "pointer-accent",
)) {
  assertInstalled(item.name, item.file, item.markers);
}

cpSync(path.join(builtDir, "scroll-storytelling.json"), path.join(dest, "scroll-storytelling.json"));
run(
  pnpm[0],
  [...pnpm.slice(1), "dlx", "shadcn@latest", "add", "./scroll-storytelling.json", "--yes", "--overwrite"],
  dest,
);

for (const item of items.filter((entry) =>
  ["sticky-stack", "horizontal-gallery", "pinned-story"].includes(entry.name),
)) {
  assertInstalled(item.name, item.file, item.markers);
}

cpSync(path.join(builtDir, "production-shell.json"), path.join(dest, "production-shell.json"));
run(
  pnpm[0],
  [...pnpm.slice(1), "dlx", "shadcn@latest", "add", "./production-shell.json", "--yes", "--overwrite"],
  dest,
);

for (const item of items.filter((entry) =>
  [
    "project-config",
    "project-providers",
    "site-navigation",
    "responsive-media",
    "seo-foundations",
    "route-transitions",
  ].includes(entry.name),
)) {
  assertInstalled(item.name, item.file, item.markers);
}

writeFileSync(
  path.join(dest, "app", "installed-smoke.tsx"),
  `"use client";

import { HorizontalGallery, HorizontalGalleryItem } from "@/components/horizontal-gallery";
import { ImageReveal } from "@/components/image-reveal";
import { Magnetic } from "@/components/magnetic";
import { MotionProfileProvider } from "@/components/motion-profile-provider";
import { Parallax } from "@/components/parallax";
import { PinnedStory } from "@/components/pinned-story";
import { PointerAccent } from "@/components/pointer-accent";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Stagger, StaggerItem } from "@/components/stagger";
import { StickyStack, StickyStackItem } from "@/components/sticky-stack";
import { TextReveal } from "@/components/text-reveal";

export function InstalledSmoke() {
  return (
    <MotionProfileProvider>
      <SmoothScrollProvider>
        <ScrollProgress />
        <Reveal>Reveal</Reveal>
        <Stagger>
          <StaggerItem>One</StaggerItem>
        </Stagger>
        <TextReveal text="Accessible text." />
        <Parallax>Parallax</Parallax>
        <Magnetic>
          <button type="button">Magnetic</button>
        </Magnetic>
        <ImageReveal>
          <img alt="Specimen" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>" />
        </ImageReveal>
        <PointerAccent enabled={false} />
        <StickyStack>
          <StickyStackItem>Stack</StickyStackItem>
        </StickyStack>
        <HorizontalGallery>
          <HorizontalGalleryItem>Pane</HorizontalGalleryItem>
        </HorizontalGallery>
        <PinnedStory
          steps={[{ title: "One" }]}
          renderVisual={() => <div>Visual</div>}
          renderStep={({ step }) => <p>{step.title}</p>}
        />
      </SmoothScrollProvider>
    </MotionProfileProvider>
  );
}
`,
);

run(pnpm[0], [...pnpm.slice(1), "typecheck"], dest);
run(pnpm[0], [...pnpm.slice(1), "build"], dest);

console.log("Registry install proof passed for every item, the bundle, and compile.");
