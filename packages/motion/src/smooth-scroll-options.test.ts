import { describe, expect, it } from "vitest";
import {
  resolveSmoothScrollMode,
  shouldEnableLenis,
  shouldPreventLenis,
  SMOOTH_SCROLL_DEFAULTS,
} from "./smooth-scroll-options";

describe("smooth scroll policy", () => {
  it("uses conservative defaults", () => {
    expect(SMOOTH_SCROLL_DEFAULTS.lerp).toBe(0.1);
    expect(SMOOTH_SCROLL_DEFAULTS.autoRaf).toBe(false);
    expect(SMOOTH_SCROLL_DEFAULTS.anchors).toBe(true);
    expect(SMOOTH_SCROLL_DEFAULTS.stopInertiaOnNavigate).toBe(true);
    expect(SMOOTH_SCROLL_DEFAULTS.syncTouch).toBe(false);
  });

  it("resolves reduced motion to native", () => {
    expect(
      resolveSmoothScrollMode({ reduce: true, finePointer: true }),
    ).toBe("reduced-motion");
    expect(
      shouldEnableLenis(
        resolveSmoothScrollMode({ reduce: true, finePointer: true }),
      ),
    ).toBe(false);
  });

  it("resolves coarse pointers to native touch", () => {
    expect(
      resolveSmoothScrollMode({ reduce: false, finePointer: false }),
    ).toBe("native-touch");
    expect(
      shouldEnableLenis(
        resolveSmoothScrollMode({ reduce: false, finePointer: false }),
      ),
    ).toBe(false);
  });

  it("enables Lenis only for fine-pointer desktops without reduced motion", () => {
    expect(
      resolveSmoothScrollMode({ reduce: false, finePointer: true }),
    ).toBe("smooth");
    expect(
      shouldEnableLenis(
        resolveSmoothScrollMode({ reduce: false, finePointer: true }),
      ),
    ).toBe(true);
  });

  it("prevents smoothing inside data-lenis-prevent and dialogs", () => {
    const root = document.createElement("div");
    const nested = document.createElement("div");
    nested.setAttribute("data-lenis-prevent", "");
    const child = document.createElement("p");
    nested.append(child);
    root.append(nested);
    document.body.append(root);
    expect(shouldPreventLenis(child)).toBe(true);

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    const dialogChild = document.createElement("div");
    dialog.append(dialogChild);
    document.body.append(dialog);
    expect(shouldPreventLenis(dialogChild)).toBe(true);

    const plain = document.createElement("div");
    document.body.append(plain);
    expect(shouldPreventLenis(plain)).toBe(false);
  });
});
