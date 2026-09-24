import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  attachGsapLenisSync,
  getGsapLenisSyncCount,
} from "./smooth-scroll-sync";
import { gsap, ScrollTrigger } from "./gsap";

function createFakeLenis() {
  const listeners = new Set<() => void>();
  return {
    raf: vi.fn(),
    on: vi.fn((_event: string, fn: () => void) => {
      listeners.add(fn);
    }),
    off: vi.fn((_event: string, fn: () => void) => {
      listeners.delete(fn);
    }),
  };
}

describe("gsap lenis sync", () => {
  beforeEach(() => {
    window.matchMedia = ((query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds one ticker subscription and removes it on cleanup", () => {
    const lenis = createFakeLenis();
    const addSpy = vi.spyOn(gsap.ticker, "add");
    const removeSpy = vi.spyOn(gsap.ticker, "remove");
    const detach = attachGsapLenisSync(() => lenis as never);
    expect(getGsapLenisSyncCount()).toBe(1);
    expect(addSpy.mock.calls.length).toBeGreaterThan(0);
    detach();
    expect(getGsapLenisSyncCount()).toBe(0);
    expect(removeSpy.mock.calls.length).toBeGreaterThan(0);
  });

  it("does not keep duplicate subscriptions after remount", () => {
    const lenis = createFakeLenis();
    const first = attachGsapLenisSync(() => lenis as never);
    const second = attachGsapLenisSync(() => lenis as never);
    expect(getGsapLenisSyncCount()).toBe(1);
    first();
    expect(getGsapLenisSyncCount()).toBe(1);
    second();
    expect(getGsapLenisSyncCount()).toBe(0);
  });

  it("converts GSAP seconds to Lenis milliseconds", () => {
    const lenis = createFakeLenis();
    const addSpy = vi.spyOn(gsap.ticker, "add");
    const detach = attachGsapLenisSync(() => lenis as never);
    const ticker = addSpy.mock.calls.at(-1)?.[0];
    ticker?.(0.016, 0.016, 1, 16);
    expect(lenis.raf).toHaveBeenCalledWith(16);
    expect(lenis.on).toHaveBeenCalledWith("scroll", expect.any(Function));
    const onScroll = vi.mocked(lenis.on).mock.calls[0]?.[1];
    const updateSpy = vi.spyOn(ScrollTrigger, "update");
    onScroll?.();
    expect(updateSpy).toHaveBeenCalled();
    detach();
  });
});
