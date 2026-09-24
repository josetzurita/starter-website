import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const registryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectSrc = path.resolve(registryRoot, "../../packages/project/src");
const motionSrc = path.resolve(registryRoot, "../../packages/motion/src");
const templateRoot = path.resolve(registryRoot, "../../templates/client-site");

const LOCAL_CN = `function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}`;

const LOCAL_Z = `const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 30,
  dialog: 40,
  toast: 50,
  debug: 60,
} as const;`;

function normalizeSource(source) {
  return source.replaceAll("\r\n", "\n").replaceAll("\r", "\n").replace(/\n{3,}/g, "\n\n");
}

function rewriteProjectSource(source) {
  let next = normalizeSource(source)
    .replace(/import \{ cn \} from ["']@cds\/core["'];\n*/g, "")
    .replace(/import \{ zIndex \} from ["']@cds\/core["'];\n*/g, "")
    .replace(
      /import \{ ScrollTrigger \} from ["']@cds\/motion["'];/g,
      'import { ScrollTrigger } from "./gsap";',
    )
    .replace(
      /import \{ useSmoothScroll \} from ["']@cds\/motion["'];/g,
      'import { useSmoothScroll } from "./use-smooth-scroll";',
    )
    .replace(
      /from ["']@cds\/motion\/motion-provider["']/g,
      'from "./motion-provider"',
    )
    .replace(
      /from ["']@cds\/motion\/motion-profile-provider["']/g,
      'from "./motion-profile-provider"',
    )
    .replace(
      /from ["']@cds\/motion\/smooth-scroll-provider["']/g,
      'from "./smooth-scroll-provider"',
    )
    .replace(
      /import \{ PointerAccent \} from ["']@cds\/motion["'];/g,
      'import { PointerAccent } from "./pointer-accent";',
    );

  const extras = [];
  if (next.includes("cn(") && !next.includes("function cn(")) {
    extras.push(LOCAL_CN);
  }
  if (next.includes("zIndex.") && !next.includes("const zIndex")) {
    extras.push(LOCAL_Z);
  }

  if (!extras.length) {
    return next.endsWith("\n") ? next : `${next}\n`;
  }

  const useClient = next.startsWith('"use client";\n') ? '"use client";\n' : "";
  const rest = useClient ? next.slice(useClient.length).replace(/^\n+/, "") : next;
  const extraBlock = `${extras.join("\n\n")}\n\n`;
  const combined = `${useClient ? `${useClient}\n` : ""}${extraBlock}${rest}`;
  return combined.endsWith("\n") ? combined : `${combined}\n`;
}

const PROFILE_FILES = [
  { from: "resolve-tween.ts", to: "resolve-tween.ts" },
  { from: "use-motion-profile.ts", to: "use-motion-profile.ts" },
  { from: "profiles/types.ts", to: "profiles/types.ts" },
  { from: "profiles/create-motion-profile.ts", to: "profiles/create-motion-profile.ts" },
  { from: "profiles/house.ts", to: "profiles/house.ts" },
];

const MOTION_PROVIDER_FILES = [
  { from: "motion-provider.tsx", to: "motion-provider.tsx" },
  { from: "motion-profile-provider.tsx", to: "motion-profile-provider.tsx" },
  { from: "register-motion-eases.ts", to: "register-motion-eases.ts" },
  { from: "export-motion-profile.ts", to: "export-motion-profile.ts" },
  { from: "gsap-ease-names.ts", to: "gsap-ease-names.ts" },
  { from: "gsap.ts", to: "gsap.ts" },
  { from: "smooth-scroll-provider.tsx", to: "smooth-scroll-provider.tsx" },
  { from: "use-smooth-scroll.ts", to: "use-smooth-scroll.ts" },
  { from: "smooth-scroll-options.ts", to: "smooth-scroll-options.ts" },
  { from: "smooth-scroll-sync.ts", to: "smooth-scroll-sync.ts" },
  { from: "motion-policy.ts", to: "motion-policy.ts" },
  { from: "reduced-motion.ts", to: "reduced-motion.ts" },
  { from: "clamp.ts", to: "clamp.ts" },
  { from: "pointer-accent.tsx", to: "pointer-accent.tsx" },
  { from: "pointer-accent-options.ts", to: "pointer-accent-options.ts" },
  ...PROFILE_FILES,
];

const items = [
  {
    name: "project-config",
    source: "project",
    files: [{ from: "lib/project-config.ts", to: "lib/project-config.ts" }],
  },
  {
    name: "project-providers",
    source: "mixed",
    files: [
      { from: "components/project-providers.tsx", to: "project-providers.tsx", origin: "project" },
      { from: "components/route-transition-provider.tsx", to: "route-transition-provider.tsx", origin: "project" },
      { from: "components/route-transition-types.ts", to: "route-transition-types.ts", origin: "project" },
      { from: "components/use-route-transition.ts", to: "use-route-transition.ts", origin: "project" },
      ...MOTION_PROVIDER_FILES.map((file) => ({ ...file, origin: "motion" })),
    ],
  },
  {
    name: "site-navigation",
    source: "project",
    files: [
      { from: "components/skip-link.tsx", to: "skip-link.tsx" },
      { from: "components/main-content.tsx", to: "main-content.tsx" },
      { from: "components/site-header.tsx", to: "site-header.tsx" },
      { from: "components/desktop-navigation.tsx", to: "desktop-navigation.tsx" },
      { from: "components/mobile-navigation.tsx", to: "mobile-navigation.tsx" },
      { from: "components/navigation-toggle.tsx", to: "navigation-toggle.tsx" },
      { from: "components/transition-link.tsx", to: "transition-link.tsx" },
      { from: "components/navigation-types.ts", to: "navigation-types.ts" },
      { from: "components/classify-navigation.ts", to: "classify-navigation.ts" },
      { from: "components/use-route-transition.ts", to: "use-route-transition.ts" },
      { from: "components/route-transition-types.ts", to: "route-transition-types.ts" },
    ],
  },
  {
    name: "responsive-media",
    source: "project",
    files: [
      { from: "components/responsive-image.tsx", to: "responsive-image.tsx" },
      { from: "components/responsive-video.tsx", to: "responsive-video.tsx" },
      { from: "components/media-frame.tsx", to: "media-frame.tsx" },
      { from: "components/aspect-media.tsx", to: "aspect-media.tsx" },
    ],
  },
  {
    name: "seo-foundations",
    source: "project",
    files: [
      { from: "lib/seo.ts", to: "lib/seo.ts" },
      { from: "lib/project-config.ts", to: "lib/project-config.ts" },
      { from: "components/not-found-foundation.tsx", to: "not-found-foundation.tsx" },
      { from: "components/error-foundation.tsx", to: "error-foundation.tsx" },
    ],
  },
  {
    name: "route-transitions",
    source: "mixed",
    files: [
      { from: "components/route-transition-provider.tsx", to: "route-transition-provider.tsx", origin: "project" },
      { from: "components/route-transition-types.ts", to: "route-transition-types.ts", origin: "project" },
      { from: "components/use-route-transition.ts", to: "use-route-transition.ts", origin: "project" },
      { from: "components/classify-navigation.ts", to: "classify-navigation.ts", origin: "project" },
      { from: "gsap.ts", to: "gsap.ts", origin: "motion" },
      { from: "use-smooth-scroll.ts", to: "use-smooth-scroll.ts", origin: "motion" },
      { from: "smooth-scroll-options.ts", to: "smooth-scroll-options.ts", origin: "motion" },
      { from: "motion-policy.ts", to: "motion-policy.ts", origin: "motion" },
      { from: "reduced-motion.ts", to: "reduced-motion.ts", origin: "motion" },
    ],
  },
];

const templateCopies = [
  { fromItem: "project-config", from: "lib/project-config.ts", to: "lib/project-config.ts" },
  { fromItem: "seo-foundations", from: "lib/seo.ts", to: "lib/seo.ts" },
  { fromItem: "seo-foundations", from: "not-found-foundation.tsx", to: "components/not-found-foundation.tsx" },
  { fromItem: "seo-foundations", from: "error-foundation.tsx", to: "components/error-foundation.tsx" },
  { fromItem: "project-providers", from: "project-providers.tsx", to: "components/project-providers.tsx" },
  { fromItem: "site-navigation", from: "skip-link.tsx", to: "components/skip-link.tsx" },
  { fromItem: "site-navigation", from: "main-content.tsx", to: "components/main-content.tsx" },
  { fromItem: "site-navigation", from: "site-header.tsx", to: "components/site-header.tsx" },
  { fromItem: "site-navigation", from: "desktop-navigation.tsx", to: "components/desktop-navigation.tsx" },
  { fromItem: "site-navigation", from: "mobile-navigation.tsx", to: "components/mobile-navigation.tsx" },
  { fromItem: "site-navigation", from: "navigation-toggle.tsx", to: "components/navigation-toggle.tsx" },
  { fromItem: "site-navigation", from: "transition-link.tsx", to: "components/transition-link.tsx" },
  { fromItem: "site-navigation", from: "navigation-types.ts", to: "components/navigation-types.ts" },
  { fromItem: "site-navigation", from: "classify-navigation.ts", to: "components/classify-navigation.ts" },
  { fromItem: "site-navigation", from: "use-route-transition.ts", to: "components/use-route-transition.ts" },
  { fromItem: "site-navigation", from: "route-transition-types.ts", to: "components/route-transition-types.ts" },
  { fromItem: "responsive-media", from: "responsive-image.tsx", to: "components/responsive-image.tsx" },
  { fromItem: "responsive-media", from: "responsive-video.tsx", to: "components/responsive-video.tsx" },
  { fromItem: "responsive-media", from: "media-frame.tsx", to: "components/media-frame.tsx" },
  { fromItem: "responsive-media", from: "aspect-media.tsx", to: "components/aspect-media.tsx" },
  { fromItem: "route-transitions", from: "route-transition-provider.tsx", to: "components/route-transition-provider.tsx" },
];

async function writeFileEnsured(dest, contents) {
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, contents);
}

async function main() {
  for (const item of items) {
    const destDir = path.join(registryRoot, "registry", "default", item.name);
    await mkdir(destDir, { recursive: true });
    for (const file of item.files) {
      const origin = file.origin ?? item.source;
      const root = origin === "motion" ? motionSrc : projectSrc;
      const source = await readFile(path.join(root, file.from), "utf8");
      const transformed = origin === "project" ? rewriteProjectSource(source) : normalizeSource(source);
      await writeFileEnsured(
        path.join(destDir, file.to),
        transformed.endsWith("\n") ? transformed : `${transformed}\n`,
      );
    }
  }

  for (const copy of templateCopies) {
    const source = await readFile(
      path.join(registryRoot, "registry", "default", copy.fromItem, copy.from),
      "utf8",
    );
    await writeFileEnsured(path.join(templateRoot, copy.to), source);
  }

  const providerDir = path.join(registryRoot, "registry", "default", "project-providers");
  for (const file of MOTION_PROVIDER_FILES) {
    const source = await readFile(path.join(providerDir, file.to), "utf8");
    await writeFileEnsured(path.join(templateRoot, "components", file.to), source);
  }

  const registryPath = path.join(registryRoot, "registry.json");
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  const bundleNames = [
    "project-config",
    "project-providers",
    "site-navigation",
    "responsive-media",
    "seo-foundations",
    "route-transitions",
  ];
  const files = [];
  const seen = new Set();
  for (const name of bundleNames) {
    const item = registry.items.find((entry) => entry.name === name);
    if (!item) {
      throw new Error(`Missing registry item ${name} while building production-shell`);
    }
    for (const file of item.files) {
      if (seen.has(file.target)) {
        continue;
      }
      seen.add(file.target);
      files.push(file);
    }
  }
  const shell = {
    name: "production-shell",
    type: "registry:block",
    title: "Production shell",
    description:
      "Project configuration, providers, navigation, media, SEO, and route transitions.",
    files,
  };
  const existing = registry.items.findIndex((entry) => entry.name === "production-shell");
  if (existing === -1) {
    registry.items.push(shell);
  } else {
    registry.items[existing] = shell;
  }
  await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
