import type { CubicBezier, MotionProfileData, SpringConfig } from "@cds/motion";
import { HOUSE_MOTION_PROFILE } from "@cds/motion";

export const WORKBENCH_STORAGE_KEY = "cds.easing-workbench.v1";

export type CurveSlotId = "a" | "b" | "c";

export type CurveSlot = {
  id: CurveSlotId;
  enabled: boolean;
  bezier: CubicBezier;
};

export type WorkbenchDraft = {
  slots: CurveSlot[];
  activeSlot: CurveSlotId;
  duration: number;
  distance: number;
  slowMo: boolean;
  loop: boolean;
  spring: SpringConfig;
  profile: MotionProfileData;
};

export function houseWorkbenchDraft(): WorkbenchDraft {
  return {
    slots: [
      { id: "a", enabled: true, bezier: HOUSE_MOTION_PROFILE.easing.enter },
      { id: "b", enabled: false, bezier: HOUSE_MOTION_PROFILE.easing.settle },
      { id: "c", enabled: false, bezier: HOUSE_MOTION_PROFILE.easing.move },
    ],
    activeSlot: "a",
    duration: HOUSE_MOTION_PROFILE.duration.base,
    distance: 48,
    slowMo: false,
    loop: false,
    spring: { ...HOUSE_MOTION_PROFILE.spring.pop },
    profile: {
      easing: { ...HOUSE_MOTION_PROFILE.easing },
      spring: { pop: { ...HOUSE_MOTION_PROFILE.spring.pop } },
      duration: { ...HOUSE_MOTION_PROFILE.duration },
      stagger: { ...HOUSE_MOTION_PROFILE.stagger },
    },
  };
}

function isBezier(value: unknown): value is CubicBezier {
  return (
    Array.isArray(value) &&
    value.length === 4 &&
    value.every((entry) => typeof entry === "number" && Number.isFinite(entry))
  );
}

export function parseWorkbenchDraft(raw: string | null): WorkbenchDraft | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<WorkbenchDraft>;
    const fallback = houseWorkbenchDraft();
    if (!Array.isArray(parsed.slots) || parsed.slots.length === 0) {
      return null;
    }
    return {
      ...fallback,
      ...parsed,
      slots: fallback.slots.map((slot, index) => {
        const next = parsed.slots?.[index];
        if (!next || !isBezier(next.bezier)) {
          return slot;
        }
        return {
          id: slot.id,
          enabled: Boolean(next.enabled) || slot.id === "a",
          bezier: next.bezier,
        };
      }),
      spring: {
        type: "spring",
        stiffness: Number(parsed.spring?.stiffness) || fallback.spring.stiffness,
        damping: Number(parsed.spring?.damping) || fallback.spring.damping,
        mass: Number(parsed.spring?.mass) || fallback.spring.mass,
        velocity: parsed.spring?.velocity,
      },
      profile: {
        easing: { ...fallback.profile.easing, ...parsed.profile?.easing },
        spring: {
          pop: {
            ...fallback.profile.spring.pop,
            ...parsed.profile?.spring?.pop,
            type: "spring",
          },
        },
        duration: { ...fallback.profile.duration, ...parsed.profile?.duration },
        stagger: { ...fallback.profile.stagger, ...parsed.profile?.stagger },
      },
    };
  } catch {
    return null;
  }
}

export function readWorkbenchDraft(
  storage: Pick<Storage, "getItem"> = window.localStorage,
): WorkbenchDraft {
  return parseWorkbenchDraft(storage.getItem(WORKBENCH_STORAGE_KEY)) ?? houseWorkbenchDraft();
}

export function writeWorkbenchDraft(
  draft: WorkbenchDraft,
  storage: Pick<Storage, "setItem"> = window.localStorage,
) {
  storage.setItem(WORKBENCH_STORAGE_KEY, JSON.stringify(draft));
}

export function clearWorkbenchDraft(
  storage: Pick<Storage, "removeItem"> = window.localStorage,
) {
  storage.removeItem(WORKBENCH_STORAGE_KEY);
}
