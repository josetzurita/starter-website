import { loadProjectConfig, type ProjectConfig } from "./lib/project-config";

const input = {
  site: {
    name: "Client Site",
    shortName: "client-site",
    description: "Independent Next.js starter generated from the CDS production shell.",
    locale: "en",
    canonicalUrl: "http://127.0.0.1:3000",
  },
  theme: {
    mode: "system",
    radius: "md",
  },
  motion: {
    profile: "house",
    smoothScroll: false,
    pageTransition: "none",
  },
  features: {
    analytics: false,
    cms: false,
  },
  pointerAccent: {
    enabled: false,
    size: 14,
    color: "oklch(0.97 0.004 250)",
    opacity: 1,
    shape: "circle",
    lag: 0.4,
    ease: "power3.out",
    stretch: 0.2,
    maxStretch: 0.6,
    offsetX: 0,
    offsetY: 0,
    blendMode: "difference",
    zIndex: "debug",
  },
} as const satisfies ProjectConfig;

export const projectConfig = loadProjectConfig(input);
