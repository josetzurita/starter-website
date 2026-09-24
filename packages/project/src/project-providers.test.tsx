/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProjectProviders } from "./components/project-providers";
import { validateProjectConfig } from "./lib/project-config";
import { defaultPointerAccentConfig } from "./lib/project-config";

vi.mock("@cds/motion/motion-provider", () => ({
  MotionProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="motion-provider">{children}</div>
  ),
}));

vi.mock("@cds/motion/motion-profile-provider", () => ({
  MotionProfileProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="motion-profile-provider">{children}</div>
  ),
}));

vi.mock("@cds/motion/smooth-scroll-provider", () => ({
  SmoothScrollProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="smooth-scroll-provider">{children}</div>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@cds/motion", () => ({
  ScrollTrigger: { refresh: vi.fn() },
  PointerAccent: () => <div data-testid="pointer-accent-layer" />,
  useSmoothScroll: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    resize: vi.fn(),
    lenis: null,
    mode: "reduced-motion",
    scrollTo: vi.fn(),
  }),
}));

const base = {
  site: {
    name: "North Studio",
    shortName: "north-studio",
    description: "A client production site.",
    locale: "en",
    canonicalUrl: "https://north.example",
  },
  theme: { mode: "system" as const, radius: "md" as const },
  features: { analytics: false, cms: false },
  pointerAccent: defaultPointerAccentConfig(),
};

describe("ProjectProviders combinations", () => {
  it("keeps Motion providers when optional layers are off", () => {
    const config = validateProjectConfig({
      ...base,
      motion: { profile: "house", smoothScroll: false, pageTransition: "none" },
    });
    render(
      <ProjectProviders config={config}>
        <p>Child</p>
      </ProjectProviders>,
    );
    expect(screen.getByTestId("motion-provider")).toBeTruthy();
    expect(screen.queryByTestId("smooth-scroll-provider")).toBeNull();
    expect(screen.getByText("Child")).toBeTruthy();
    expect(screen.queryByTestId("pointer-accent-layer")).toBeNull();
  });

  it("mounts the overlay slot only when page transitions are overlay", () => {
    const overlayConfig = validateProjectConfig({
      ...base,
      motion: { profile: "house", smoothScroll: false, pageTransition: "overlay" },
    });
    const { rerender } = render(
      <ProjectProviders
        config={overlayConfig}
        renderOverlay={() => <div data-testid="route-overlay">Cover</div>}
      >
        <p>Child</p>
      </ProjectProviders>,
    );
    expect(screen.getByTestId("route-overlay")).toBeTruthy();

    const noneConfig = validateProjectConfig({
      ...base,
      motion: { profile: "house", smoothScroll: false, pageTransition: "none" },
    });
    rerender(
      <ProjectProviders
        config={noneConfig}
        renderOverlay={() => <div data-testid="route-overlay">Cover</div>}
      >
        <p>Child</p>
      </ProjectProviders>,
    );
    expect(screen.queryByTestId("route-overlay")).toBeNull();
  });

  it("wraps Lenis only when smooth scroll is enabled", () => {
    const config = validateProjectConfig({
      ...base,
      motion: { profile: "house", smoothScroll: true, pageTransition: "none" },
    });
    render(
      <ProjectProviders config={config}>
        <p>Child</p>
      </ProjectProviders>,
    );
    expect(screen.getByTestId("smooth-scroll-provider")).toBeTruthy();
  });

  it("mounts PointerAccent only when the feature flag is on", () => {
    const config = validateProjectConfig({
      ...base,
      motion: { profile: "house", smoothScroll: false, pageTransition: "none" },
      pointerAccent: { ...defaultPointerAccentConfig(), enabled: true },
    });
    render(
      <ProjectProviders config={config}>
        <p>Child</p>
      </ProjectProviders>,
    );
    expect(screen.getByTestId("pointer-accent-layer")).toBeTruthy();
  });
});
