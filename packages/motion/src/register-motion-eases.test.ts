import { afterEach, describe, expect, it, vi } from "vitest";
import { houseMotionProfile } from "./profiles/create-motion-profile";
import { CustomEase } from "gsap/CustomEase";
import {
  getMotionEaseRegistrationSignature,
  registerMotionEases,
  resetMotionEaseRegistration,
} from "./register-motion-eases";
import { GSAP_EASE_NAMES, GSAP_SCROLL_SCRUB_EASE } from "./gsap-ease-names";

describe("registerMotionEases", () => {
  afterEach(() => {
    resetMotionEaseRegistration();
    vi.restoreAllMocks();
  });

  it("registers semantic names once for the same profile", () => {
    const createSpy = vi.spyOn(CustomEase, "create");
    registerMotionEases(houseMotionProfile);
    registerMotionEases(houseMotionProfile);
    expect(createSpy).toHaveBeenCalledTimes(5);
    expect(getMotionEaseRegistrationSignature()).toContain("0.16");
    expect(GSAP_EASE_NAMES.enter).toBe("cds-enter");
    expect(CustomEase.get("cds-enter")).toBeTypeOf("function");
  });

  it("does not use a native GSAP name for scroll-scrubbed motion", () => {
    expect(GSAP_SCROLL_SCRUB_EASE).toBe("none");
    expect(GSAP_EASE_NAMES.linear).toBe("cds-linear");
  });
});
