import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { createMotionProfile } from "./profiles/create-motion-profile";
import { MotionProfileProvider } from "./motion-profile-provider";
import { useMotionProfile } from "./use-motion-profile";
import { houseMotionProfile } from "./profiles/create-motion-profile";

function readProfile(onRead: (profile: ReturnType<typeof useMotionProfile>) => void) {
  function Probe() {
    onRead(useMotionProfile());
    return null;
  }
  return Probe;
}

describe("MotionProfileProvider", () => {
  it("defaults to the house profile", async () => {
    const rootEl = document.createElement("div");
    const root = createRoot(rootEl);
    let current = houseMotionProfile;
    const Probe = readProfile((profile) => {
      current = profile;
    });
    await act(async () => {
      root.render(createElement(Probe));
    });
    expect(current.duration.base).toBe(0.55);
    await act(async () => {
      root.unmount();
    });
  });

  it("applies a project override", async () => {
    const rootEl = document.createElement("div");
    const root = createRoot(rootEl);
    let current = houseMotionProfile;
    const Probe = readProfile((profile) => {
      current = profile;
    });
    await act(async () => {
      root.render(
        // eslint-disable-next-line react/no-children-prop -- createElement typing requires children in props
        createElement(MotionProfileProvider, {
          profile: createMotionProfile({ duration: { base: 0.4 } }),
          children: createElement(Probe),
        }),
      );
    });
    expect(current.duration.base).toBe(0.4);
    expect(current.duration.fast).toBe(0.28);
    await act(async () => {
      root.unmount();
    });
  });
});
