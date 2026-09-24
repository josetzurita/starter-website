import { describe, expect, it } from "vitest";
import { houseMotionProfile } from "./profiles/create-motion-profile";
import {
  motionProfileToCss,
  motionProfileToGsapRegistration,
  motionProfileToJson,
  motionProfileToMotionTs,
} from "./export-motion-profile";

describe("motion profile exports", () => {
  it("emits CSS custom properties", () => {
    const css = motionProfileToCss(houseMotionProfile);
    expect(css).toContain("--ease-enter: cubic-bezier(0.16, 1, 0.3, 1);");
    expect(css).toContain("--duration-base: 0.55s;");
    expect(css).toContain("--stagger-normal: 0.065s;");
  });

  it("emits Motion TypeScript", () => {
    const source = motionProfileToMotionTs(houseMotionProfile);
    expect(source).toContain("createMotionProfile");
    expect(source).toContain('"enter": [');
  });

  it("emits GSAP registration data", () => {
    const data = motionProfileToGsapRegistration(houseMotionProfile);
    expect(data["cds-enter"]).toBe("0.16,1,0.3,1");
    expect(data["cds-settle"]).toBe("0.22,1,0.36,1");
  });

  it("emits complete JSON without runtime functions", () => {
    const json = motionProfileToJson(houseMotionProfile);
    const parsed = JSON.parse(json) as { easing: unknown };
    expect(parsed.easing).toBeTruthy();
    expect(json).not.toContain('"ease":');
  });
});
