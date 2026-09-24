import { describe, expect, it } from "vitest";
import {
  clamp,
  clampImageScale,
  clampMagneticOffset,
  clampMagneticStrength,
  clampParallaxSpeed,
  clampStaggerInterval,
  MOTION_DEFAULTS,
  parallaxTravelPx,
} from "./clamp";

describe("clamp helpers", () => {
  it("clamps to inclusive bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it("uses documented defaults", () => {
    expect(MOTION_DEFAULTS.staggerInterval).toBe(0.08);
    expect(MOTION_DEFAULTS.parallaxSpeed).toBe(0.2);
    expect(MOTION_DEFAULTS.magneticStrength).toBe(0.35);
    expect(MOTION_DEFAULTS.imageScale).toBe(1);
  });

  it("clamps parallax speed to the safe range", () => {
    expect(clampParallaxSpeed(-1)).toBe(0);
    expect(clampParallaxSpeed(0.2)).toBe(0.2);
    expect(clampParallaxSpeed(2)).toBe(MOTION_DEFAULTS.parallaxSpeedMax);
  });

  it("derives parallax travel from clamped speed", () => {
    expect(parallaxTravelPx(0)).toBe(0);
    expect(parallaxTravelPx(999)).toBe(
      MOTION_DEFAULTS.parallaxSpeedMax * MOTION_DEFAULTS.parallaxRangePx,
    );
  });

  it("clamps magnetic strength and offset", () => {
    expect(clampMagneticStrength(-1)).toBe(0);
    expect(clampMagneticStrength(0.5)).toBe(0.5);
    expect(clampMagneticStrength(4)).toBe(1);
    expect(clampMagneticOffset(-8)).toBe(0);
    expect(clampMagneticOffset(16)).toBe(16);
    expect(clampMagneticOffset(80)).toBe(MOTION_DEFAULTS.magneticMaxOffsetMax);
  });

  it("clamps stagger interval and image scale", () => {
    expect(clampStaggerInterval(-0.2)).toBe(0);
    expect(clampStaggerInterval(0.08)).toBe(0.08);
    expect(clampStaggerInterval(4)).toBe(1);
    expect(clampImageScale(0.5)).toBe(1);
    expect(clampImageScale(1.04)).toBe(1.04);
    expect(clampImageScale(2)).toBe(MOTION_DEFAULTS.imageScaleMax);
  });
});
