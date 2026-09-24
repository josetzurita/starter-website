/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransitionLink } from "./components/transition-link";
import { RouteTransitionProvider } from "./components/route-transition-provider";

const push = vi.fn();
const motionState = vi.hoisted(() => ({ reduce: false }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock("@cds/motion", () => ({
  ScrollTrigger: { refresh: vi.fn() },
  useSmoothScroll: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    resize: vi.fn(),
    lenis: null,
    mode: "smooth",
    scrollTo: vi.fn(),
  }),
}));

vi.mock("motion/react", () => ({
  useReducedMotion: () => motionState.reduce,
}));

describe("TransitionLink", () => {
  afterEach(() => {
    cleanup();
    push.mockClear();
    motionState.reduce = false;
    vi.useRealTimers();
  });

  it("intercepts internal clicks when overlay navigation is enabled", () => {
    render(
      <RouteTransitionProvider enabled renderOverlay={() => <div>Cover</div>}>
        <TransitionLink href="/work">Work</TransitionLink>
      </RouteTransitionProvider>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Work" }));
    expect(push).not.toHaveBeenCalled();
  });

  it("lets modified clicks through", () => {
    render(
      <RouteTransitionProvider enabled>
        <TransitionLink href="/work">Work</TransitionLink>
      </RouteTransitionProvider>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Work" }), { metaKey: true });
    expect(push).not.toHaveBeenCalled();
  });

  it("does not intercept hash links", () => {
    render(
      <RouteTransitionProvider
        enabled
        renderOverlay={({ phase }) => (
          <div data-testid="overlay" data-phase={phase}>
            {phase}
          </div>
        )}
      >
        <TransitionLink href="#after">Hash</TransitionLink>
      </RouteTransitionProvider>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Hash" }));
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByTestId("overlay").getAttribute("data-phase")).toBe("idle");
  });

  it("does not cover the page under reduced motion", () => {
    motionState.reduce = true;
    render(
      <RouteTransitionProvider enabled renderOverlay={() => <div data-testid="overlay">Cover</div>}>
        <TransitionLink href="/work">Work</TransitionLink>
      </RouteTransitionProvider>,
    );
    expect(screen.queryByTestId("overlay")).toBeNull();
    fireEvent.click(screen.getByRole("link", { name: "Work" }));
    expect(push).toHaveBeenCalledWith("/work");
  });

  it("uncovers the page if navigation never completes", async () => {
    vi.useFakeTimers();
    render(
      <RouteTransitionProvider
        enabled
        timeoutMs={400}
        renderOverlay={({ phase }) => (
          <div data-testid="overlay" data-phase={phase}>
            {phase}
          </div>
        )}
      >
        <TransitionLink href="/work">Work</TransitionLink>
      </RouteTransitionProvider>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Work" }));
    expect(screen.getByTestId("overlay").getAttribute("data-phase")).toBe("covering");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(screen.getByTestId("overlay").getAttribute("data-phase")).toBe("idle");
  });
});
