import { registerGsap, ScrollTrigger } from "../gsap";

function settleImage(image: HTMLImageElement): Promise<void> {
  const decode = () =>
    image.decode ? image.decode().catch(() => undefined) : Promise.resolve();

  if (image.complete) {
    return decode();
  }

  return new Promise((resolve) => {
    const finish = () => {
      void decode().finally(() => resolve());
    };
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", () => resolve(), { once: true });
  });
}

export function waitForScrollAssets(root: ParentNode): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  const images = Array.from(root.querySelectorAll("img"));
  const fonts =
    "fonts" in document
      ? document.fonts.ready.catch(() => undefined)
      : Promise.resolve();
  return Promise.all([fonts, ...images.map((image) => settleImage(image))]).then(
    () => undefined,
  );
}

export function refreshScrollLayout() {
  if (typeof window === "undefined") {
    return;
  }
  registerGsap();
  ScrollTrigger.refresh();
}

export function observeScrollRefresh(
  root: Element,
  onChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  const images = Array.from(root.querySelectorAll("img"));
  const listeners: Array<() => void> = [];

  for (const image of images) {
    const handle = () => {
      onChange();
    };
    image.addEventListener("load", handle);
    listeners.push(() => image.removeEventListener("load", handle));
  }

  const fonts = "fonts" in document ? document.fonts : null;
  if (fonts) {
    const handle = () => {
      onChange();
    };
    fonts.addEventListener("loadingdone", handle);
    listeners.push(() => fonts.removeEventListener("loadingdone", handle));
  }

  return () => {
    for (const dispose of listeners) {
      dispose();
    }
  };
}
