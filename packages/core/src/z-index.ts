export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 30,
  dialog: 40,
  toast: 50,
  debug: 60,
} as const;

export type ZIndexLayer = keyof typeof zIndex;

export const zIndexCssVars = {
  base: "--z-base",
  raised: "--z-raised",
  sticky: "--z-sticky",
  overlay: "--z-overlay",
  dialog: "--z-dialog",
  toast: "--z-toast",
  debug: "--z-debug",
} as const;
