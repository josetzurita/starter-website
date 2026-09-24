import { describe, expect, it } from "vitest";
import {
  shouldAnimateMotion,
  shouldEnableMagnetic,
  shouldEnableParallax,
  shouldEnablePointerAccent,
} from "./motion-policy";

describe("reduced-motion and pointer decisions", () => {
  it("skips animation when reduced motion is set", () => {
    expect(shouldAnimateMotion(true)).toBe(false);
    expect(shouldAnimateMotion(false)).toBe(true);
    expect(shouldAnimateMotion(null)).toBe(true);
  });

  it("disables parallax under reduced motion and below breakpoints", () => {
    expect(
      shouldEnableParallax({
        reduce: true,
        viewportWidth: 1440,
        disableBelow: 768,
      }),
    ).toBe(false);
    expect(
      shouldEnableParallax({
        reduce: false,
        viewportWidth: 600,
        disableBelow: 768,
      }),
    ).toBe(false);
    expect(
      shouldEnableParallax({
        reduce: false,
        viewportWidth: 1280,
        disableBelow: 768,
      }),
    ).toBe(true);
    expect(
      shouldEnableParallax({
        reduce: false,
        viewportWidth: null,
      }),
    ).toBe(true);
  });

  it("enables magnetic only for fine pointers that are not touch", () => {
    expect(
      shouldEnableMagnetic({
        reduce: false,
        finePointer: true,
        pointerType: "mouse",
      }),
    ).toBe(true);
    expect(
      shouldEnableMagnetic({
        reduce: true,
        finePointer: true,
        pointerType: "mouse",
      }),
    ).toBe(false);
    expect(
      shouldEnableMagnetic({
        reduce: false,
        finePointer: false,
        pointerType: "mouse",
      }),
    ).toBe(false);
    expect(
      shouldEnableMagnetic({
        reduce: false,
        finePointer: true,
        pointerType: "touch",
      }),
    ).toBe(false);
  });

  it("enables pointer accent only when flagged and on fine pointers", () => {
    expect(
      shouldEnablePointerAccent({
        enabled: true,
        reduce: false,
        finePointer: true,
        pointerType: "mouse",
      }),
    ).toBe(true);
    expect(
      shouldEnablePointerAccent({
        enabled: false,
        reduce: false,
        finePointer: true,
        pointerType: "mouse",
      }),
    ).toBe(false);
  });
});
