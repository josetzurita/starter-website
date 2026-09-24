import { registerGsap, ScrollTrigger } from "../gsap";

export const SCROLL_DEBUG_ATTR = "data-cds-scroll-debug";

export function debugMarkerConfig(enabled: boolean): boolean {
  return enabled;
}

export function countScrollTriggers(prefix?: string): number {
  if (typeof window === "undefined") {
    return 0;
  }
  registerGsap();
  const all = ScrollTrigger.getAll();
  if (!prefix) {
    return all.length;
  }
  return all.filter((trigger) => {
    const id = trigger.vars.id;
    return typeof id === "string" && id.startsWith(prefix);
  }).length;
}

export function killTriggersByPrefix(prefix: string) {
  if (typeof window === "undefined") {
    return;
  }
  registerGsap();
  for (const trigger of ScrollTrigger.getAll()) {
    const id = trigger.vars.id;
    if (typeof id === "string" && id.startsWith(prefix)) {
      trigger.kill(true);
    }
  }
}

export function applyScrollDebugAttrs(root: Element, enabled: boolean) {
  if (enabled) {
    root.setAttribute(SCROLL_DEBUG_ATTR, "true");
    return;
  }
  root.removeAttribute(SCROLL_DEBUG_ATTR);
}
