export { MotionProvider } from "./motion-provider";

export { Reveal } from "./reveal";

export { Stagger, StaggerItem } from "./stagger";

export type { StaggerItemProps, StaggerProps } from "./stagger";

export { TextReveal } from "./text-reveal";

export type { TextRevealProps } from "./text-reveal";

export { Parallax } from "./parallax";

export type { ParallaxProps } from "./parallax";

export { Magnetic } from "./magnetic";

export type { MagneticProps } from "./magnetic";

export { PointerAccent } from "./pointer-accent";

export type { PointerAccentOptions } from "./pointer-accent-options";

export {
  POINTER_ACCENT_BLEND_MODES,
  POINTER_ACCENT_DEFAULTS,
  POINTER_ACCENT_SHAPES,
  POINTER_ACCENT_Z_INDEX,
  clampPointerSpeed,
  pointerAccentHoverTransform,
  pointerAccentLayoutSize,
  pointerAccentZIndexVar,
  pointerDeformation,
  pointerHoverCoverScale,
  pointerRotationDeg,
  pointerSpeedPxPerMs,
  resolvePointerAccentOptions,
  resolvePointerEase,
} from "./pointer-accent-options";

export type {
  PointerAccentBlendMode,
  PointerAccentShape,
  PointerAccentZIndex,
  ResolvedPointerAccentOptions,
} from "./pointer-accent-options";

export { ScrollProgress } from "./scroll-progress";

export type { ScrollProgressAxis, ScrollProgressProps } from "./scroll-progress";

export { ImageReveal } from "./image-reveal";

export type { ImageRevealDirection, ImageRevealProps } from "./image-reveal";

export {

  clamp,

  clampImageScale,

  clampMagneticOffset,

  clampMagneticStrength,

  clampParallaxSpeed,

  clampStaggerInterval,

  MOTION_DEFAULTS,

  parallaxTravelPx,

} from "./clamp";

export {

  FINE_POINTER_QUERY,

  shouldAnimateMotion,

  shouldEnableMagnetic,

  shouldEnableParallax,

  shouldEnablePointerAccent,

} from "./motion-policy";

export {

  accessibleTextFromLines,

  joinTextParts,

  splitTextParts,

} from "./text-split";

export type { TextPart } from "./text-split";

export {

  getReducedMotionSnapshot,

  reducedMotionCss,

  reducedMotionQuery,

  usePrefersReducedMotion,

} from "./reduced-motion";

export { registerGsap, CustomEase, gsap, ScrollTrigger, useGSAP } from "./gsap";

export { StickyStack, StickyStackItem } from "./sticky-stack";

export type { StickyStackItemProps, StickyStackProps } from "./sticky-stack";

export { HorizontalGallery, HorizontalGalleryItem } from "./horizontal-gallery";

export type {
  HorizontalGalleryItemProps,
  HorizontalGalleryProps,
} from "./horizontal-gallery";

export { PinnedStory } from "./pinned-story";

export type {
  PinnedStoryProps,
  PinnedStoryStepContext,
  PinnedStoryVisualContext,
} from "./pinned-story";

export {
  clampDisableBelow,
  clampOpacityTo,
  clampScaleTo,
  clampStackOffset,
  horizontalTravel,
  resolveScrub,
  SCROLL_SCENE_DEFAULTS,
  SCROLL_SCRUB_EASE,
} from "./scroll/scroll-options";

export {
  resolveScrollSceneMode,
  SCROLL_BREAKPOINTS,
  shouldPinScrollScene,
} from "./scroll/scroll-breakpoints";

export { countScrollTriggers } from "./scroll/scroll-debug";

export { useScopedGsap } from "./use-scoped-gsap";

export { SmoothScrollProvider } from "./smooth-scroll-provider";

export type { SmoothScrollProviderProps } from "./smooth-scroll-provider";

export { useSmoothScroll } from "./use-smooth-scroll";

export type {

  SmoothScrollApi,

  SmoothScrollToOptions,

  SmoothScrollToTarget,

} from "./use-smooth-scroll";

export {

  LENIS_PREVENT_SELECTOR,

  resolveSmoothScrollMode,

  shouldEnableLenis,

  shouldPreventLenis,

  SMOOTH_SCROLL_DEFAULTS,

} from "./smooth-scroll-options";

export type { SmoothScrollMode, SmoothScrollOptions } from "./smooth-scroll-options";

export {

  attachGsapLenisSync,

  getGsapLenisSyncCount,

} from "./smooth-scroll-sync";

export { HOUSE_MOTION_PROFILE } from "./profiles/house";

export {

  createMotionProfile,

  houseMotionProfile,

  serializeMotionProfile,

  validateMotionProfileData,

  assertCubicBezier,

} from "./profiles/create-motion-profile";

export {

  DURATION_TOKENS,

  MotionProfileError,

  SPRING_INTENTS,

  STAGGER_TOKENS,

  TWEEN_INTENTS,

} from "./profiles/types";

export type {

  CubicBezier,

  DurationToken,

  MotionProfile,

  MotionProfileData,

  MotionProfileOverride,

  SpringConfig,

  SpringIntent,

  StaggerToken,

  TweenIntent,

} from "./profiles/types";

export { MotionProfileProvider } from "./motion-profile-provider";

export type { MotionProfileProviderProps } from "./motion-profile-provider";

export { useMotionProfile } from "./use-motion-profile";

export {

  registerMotionEases,

  getMotionEaseRegistrationSignature,

  resetMotionEaseRegistration,

} from "./register-motion-eases";

export {

  GSAP_EASE_NAMES,

  GSAP_SCROLL_SCRUB_EASE,

  NATIVE_GSAP_EASE_NAMES,

} from "./gsap-ease-names";

export { resolveTween } from "./resolve-tween";

export type { ResolveTweenOptions } from "./resolve-tween";

export {

  cubicBezierToCss,

  cubicBezierToGsap,

  motionProfileToCss,

  motionProfileToGsapRegistration,

  motionProfileToJson,

  motionProfileToMotionTs,

} from "./export-motion-profile";

