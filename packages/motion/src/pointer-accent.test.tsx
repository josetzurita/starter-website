/** @vitest-environment jsdom */
import { act } from "react";
import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let reduceMotion = false;

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => reduceMotion,
  };
});
import { gsap } from "./gsap";
import { MotionProfileProvider } from "./motion-profile-provider";
import { PointerAccent } from "./pointer-accent";
import { POINTER_ACCENT_DEFAULTS, pointerAccentLayoutSize } from "./pointer-accent-options";

function mockMatchMedia(options: { finePointer?: boolean; reduce?: boolean } | boolean) {
  const finePointer = typeof options === "boolean" ? options : (options.finePointer ?? true);
  const reduce = typeof options === "boolean" ? false : Boolean(options.reduce);
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes("prefers-reduced-motion")
        ? reduce
        : query.includes("pointer: fine")
          ? finePointer
          : false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList);
}

async function renderAccent(ui: ReactNode) {
  const rootEl = document.createElement("div");
  document.body.appendChild(rootEl);
  const root = createRoot(rootEl);
  await act(async () => {
    root.render(ui);
  });
  return { root, rootEl };
}

describe("PointerAccent", () => {
  beforeEach(() => {
    reduceMotion = false;
    mockMatchMedia(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("does not render when disabled", async () => {
    const { root, rootEl } = await renderAccent(
      <MotionProfileProvider>
        <PointerAccent enabled={false} />
      </MotionProfileProvider>,
    );
    expect(rootEl.querySelector("[data-pointer-accent]")).toBeNull();
    await act(async () => {
      root.unmount();
    });
  });

  it("keeps the native cursor and pointer events pass-through", async () => {
    const { root, rootEl } = await renderAccent(
      <MotionProfileProvider>
        <PointerAccent enabled />
      </MotionProfileProvider>,
    );
    const node = rootEl.querySelector("[data-pointer-accent]") as HTMLElement;
    expect(node).toBeTruthy();
    expect(node.style.pointerEvents).toBe("none");
    expect(node.style.cursor).not.toBe("none");
    expect(getComputedStyle(document.body).cursor).not.toBe("none");
    expect(document.documentElement.style.cursor).not.toBe("none");
    await act(async () => {
      root.unmount();
    });
  });

  it("hides until the first pointer movement and follows with GSAP", async () => {
    const quickTo = vi.spyOn(gsap, "quickTo");
    const { root, rootEl } = await renderAccent(
      <MotionProfileProvider>
        <PointerAccent enabled maxStretch={0.4} />
      </MotionProfileProvider>,
    );
    const node = rootEl.querySelector("[data-pointer-accent]") as HTMLElement;
    expect(gsap.getProperty(node, "opacity")).toBe(0);

    await act(async () => {
      window.dispatchEvent(
        Object.assign(new Event("pointermove", { bubbles: true }), {
          clientX: 40,
          clientY: 10,
          pointerType: "mouse",
        }),
      );
      window.dispatchEvent(
        Object.assign(new Event("pointermove", { bubbles: true }), {
          clientX: 120,
          clientY: 10,
          pointerType: "mouse",
        }),
      );
    });

    expect(quickTo).toHaveBeenCalled();
    const inner = rootEl.querySelector("[data-pointer-accent-inner]") as HTMLElement;
    const scaleX = Number(gsap.getProperty(inner, "scaleX"));
    expect(scaleX).toBeGreaterThanOrEqual(1);
    expect(scaleX).toBeLessThanOrEqual(1.4);
    const layout = `${pointerAccentLayoutSize(POINTER_ACCENT_DEFAULTS.size, true, POINTER_ACCENT_DEFAULTS.hoverScaleMax)}px`;
    expect(node.style.width).toBe(layout);
    expect(node.style.height).toBe(layout);
    expect(node.querySelector("svg")).toBeTruthy();
    await act(async () => {
      root.unmount();
    });
  });

  it("does not render for coarse pointers", async () => {
    mockMatchMedia({ finePointer: false });
    const { root, rootEl } = await renderAccent(
      <MotionProfileProvider>
        <PointerAccent enabled />
      </MotionProfileProvider>,
    );
    expect(rootEl.querySelector("[data-pointer-accent]")).toBeNull();
    await act(async () => {
      root.unmount();
    });
  });

  it("grows with transform scale on delegated hover targets", async () => {
    const originalQuickTo = gsap.quickTo.bind(gsap);
    const scaleXValues: number[] = [];
    vi.spyOn(gsap, "quickTo").mockImplementation((target, property, vars) => {
      const fn = originalQuickTo(target, property, vars);
      if (property === "scaleX") {
        return ((value: number) => {
          scaleXValues.push(value);
          return fn(value);
        }) as typeof fn;
      }
      return fn;
    });
    const documentAdd = vi.spyOn(document, "addEventListener");
    const { root, rootEl } = await renderAccent(
      <MotionProfileProvider>
        <PointerAccent enabled size={20} hoverScaleMax={8} hoverSelectors="button" />
        <button type="button">Target</button>
      </MotionProfileProvider>,
    );
    const outer = rootEl.querySelector("[data-pointer-accent]") as HTMLElement;
    const inner = rootEl.querySelector("[data-pointer-accent-inner]") as HTMLElement;
    const button = rootEl.querySelector("button") as HTMLButtonElement;
    Object.defineProperty(button, "getBoundingClientRect", {
      value: () => ({
        width: 160,
        height: 40,
        top: 0,
        left: 0,
        bottom: 40,
        right: 160,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });
    const overHandler = [...documentAdd.mock.calls]
      .reverse()
      .find((call) => call[0] === "pointerover")?.[1] as
      | ((event: { target: EventTarget | null; relatedTarget: EventTarget | null }) => void)
      | undefined;
    expect(overHandler).toBeTypeOf("function");

    await act(async () => {
      overHandler?.({ target: button, relatedTarget: null });
    });

    expect(scaleXValues.some((value) => value > 0.125 && value <= 1)).toBe(true);
    expect(Math.max(...scaleXValues)).toBeLessThanOrEqual(1);
    expect(outer.style.width).toBe("160px");
    expect(outer.style.height).toBe("160px");
    expect(outer.querySelector("svg")).toBeTruthy();
    expect(outer.querySelector("circle")).toBeTruthy();
    expect(inner.style.width).toBe("100%");
    expect(inner.style.height).toBe("100%");
    await act(async () => {
      root.unmount();
    });
  });

  it("cleans up listeners and GSAP tweens, including Strict Mode remounts", async () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const documentAdd = vi.spyOn(document, "addEventListener");
    const documentRemove = vi.spyOn(document, "removeEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const killSpy = vi.spyOn(gsap, "killTweensOf");
    const { root, rootEl } = await renderAccent(
      <StrictMode>
        <MotionProfileProvider>
          <PointerAccent enabled />
        </MotionProfileProvider>
      </StrictMode>,
    );
    expect(rootEl.querySelectorAll("[data-pointer-accent]").length).toBe(1);
    const moveAdds = addSpy.mock.calls.filter((call) => call[0] === "pointermove").length;
    expect(moveAdds).toBeGreaterThan(0);
    await act(async () => {
      root.unmount();
    });
    const moveRemoves = removeSpy.mock.calls.filter((call) => call[0] === "pointermove").length;
    expect(moveRemoves).toBe(moveAdds);
    const hoverAdds = documentAdd.mock.calls.filter((call) => call[0] === "pointerover").length;
    const hoverRemoves = documentRemove.mock.calls.filter((call) => call[0] === "pointerover").length;
    expect(hoverAdds).toBeGreaterThan(0);
    expect(hoverRemoves).toBe(hoverAdds);
    expect(killSpy).toHaveBeenCalled();
  });

  it("does not render when prefers-reduced-motion is active", async () => {
    reduceMotion = true;
    const { root, rootEl } = await renderAccent(
      <MotionProfileProvider>
        <PointerAccent enabled />
      </MotionProfileProvider>,
    );
    expect(rootEl.querySelector("[data-pointer-accent]")).toBeNull();
    await act(async () => {
      root.unmount();
    });
  });
});
