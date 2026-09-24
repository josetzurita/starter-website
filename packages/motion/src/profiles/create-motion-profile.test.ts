import { describe, expect, it } from "vitest";
import {
  createMotionProfile,
  houseMotionProfile,
  serializeMotionProfile,
} from "./create-motion-profile";
import { HOUSE_MOTION_PROFILE } from "./house";
import { MotionProfileError } from "./types";

describe("motion profile", () => {
  it("uses the house values as defaults", () => {
    expect(houseMotionProfile.easing.enter).toEqual([0.16, 1, 0.3, 1]);
    expect(houseMotionProfile.easing.settle).toEqual([0.22, 1, 0.36, 1]);
    expect(houseMotionProfile.easing.move).toEqual([0.65, 0, 0.35, 1]);
    expect(houseMotionProfile.easing.exit).toEqual([0.4, 0, 1, 1]);
    expect(houseMotionProfile.easing.linear).toEqual([0, 0, 1, 1]);
    expect(houseMotionProfile.spring.pop).toMatchObject({
      type: "spring",
      stiffness: 420,
      damping: 26,
      mass: 0.7,
    });
    expect(houseMotionProfile.duration).toEqual({
      instant: 0.16,
      fast: 0.28,
      base: 0.55,
      slow: 0.9,
    });
    expect(houseMotionProfile.stagger).toEqual({
      tight: 0.035,
      normal: 0.065,
      expressive: 0.1,
    });
  });

  it("lets a project override selected tokens", () => {
    const profile = createMotionProfile({
      easing: { enter: [0.2, 0.8, 0.2, 1] },
      duration: { base: 0.4 },
    });
    expect(profile.easing.enter).toEqual([0.2, 0.8, 0.2, 1]);
    expect(profile.easing.settle).toEqual(HOUSE_MOTION_PROFILE.easing.settle);
    expect(profile.duration.base).toBe(0.4);
    expect(profile.duration.fast).toBe(0.28);
    expect(profile.ease("enter")).toEqual([0.2, 0.8, 0.2, 1]);
  });

  it("rejects X control points outside 0 to 1", () => {
    expect(() =>
      createMotionProfile({ easing: { enter: [1.2, 1, 0.3, 1] } }),
    ).toThrow(MotionProfileError);
    expect(() =>
      createMotionProfile({ easing: { enter: [-0.1, 1, 0.3, 1] } }),
    ).toThrow(/X control points/);
  });

  it("permits Y overshoot outside 0 to 1", () => {
    const profile = createMotionProfile({
      easing: { enter: [0.16, 1.4, 0.3, 1] },
    });
    expect(profile.easing.enter[1]).toBe(1.4);
  });

  it("rejects non-positive duration and spring values", () => {
    expect(() => createMotionProfile({ duration: { base: 0 } })).toThrow(
      /duration.base/,
    );
    expect(() =>
      createMotionProfile({ spring: { pop: { stiffness: -1 } } }),
    ).toThrow(/stiffness/);
  });

  it("serializes data and drops runtime functions", () => {
    const json = JSON.parse(
      JSON.stringify(serializeMotionProfile(houseMotionProfile)),
    ) as Record<string, unknown>;
    expect(json.easing).toEqual(HOUSE_MOTION_PROFILE.easing);
    expect(json).not.toHaveProperty("ease");
  });
});
