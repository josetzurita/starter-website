import { describe, expect, it } from "vitest";
import { houseMotionProfile } from "./profiles/create-motion-profile";
import { createMotionProfile } from "./profiles/create-motion-profile";
import { resolveTween } from "./resolve-tween";

describe("resolveTween", () => {
  it("defaults Reveal, Stagger, and TextReveal to enter and base duration", () => {
    const tween = resolveTween(houseMotionProfile, { intent: "enter" });
    expect(tween.ease).toEqual(houseMotionProfile.easing.enter);
    expect(tween.duration).toBe(0.55);
  });

  it("defaults ImageReveal to settle", () => {
    const tween = resolveTween(houseMotionProfile, { intent: "settle" });
    expect(tween.ease).toEqual(houseMotionProfile.easing.settle);
  });

  it("keeps a raw local ease override", () => {
    const tween = resolveTween(houseMotionProfile, {
      intent: "enter",
      ease: [0.5, 0, 0.5, 1],
      duration: 0.2,
    });
    expect(tween.ease).toEqual([0.5, 0, 0.5, 1]);
    expect(tween.duration).toBe(0.2);
  });

  it("reads project profile values", () => {
    const profile = createMotionProfile({
      easing: { enter: [0.2, 0, 0.2, 1] },
      duration: { base: 0.33 },
    });
    const tween = resolveTween(profile, { intent: "enter" });
    expect(tween.ease).toEqual([0.2, 0, 0.2, 1]);
    expect(tween.duration).toBe(0.33);
  });
});
