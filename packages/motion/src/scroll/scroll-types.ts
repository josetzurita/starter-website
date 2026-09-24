export type ScrollSceneMode = "pin" | "mobile" | "reduced-motion";

export type ScrollScrub = boolean | number;

export type ScrollSceneContext = {
  mode: ScrollSceneMode;
  root: HTMLElement;
  markers: boolean;
  idPrefix: string;
  refresh: () => void;
};
