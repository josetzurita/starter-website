export {
  PROJECT_MOTION_PROFILES,
  PROJECT_PAGE_TRANSITIONS,
  PROJECT_POINTER_ACCENT_BLEND_MODES,
  PROJECT_POINTER_ACCENT_EASES,
  PROJECT_POINTER_ACCENT_SHAPES,
  PROJECT_PRESETS,
  PROJECT_RADIUS_POLICIES,
  PROJECT_THEME_MODES,
  PROJECT_Z_INDEX_LAYERS,
  ProjectConfigError,
  assertProjectConfig,
  createPresetProjectConfig,
  createProjectConfig,
  defaultPointerAccentConfig,
  htmlLang,
  htmlThemeDataset,
  isProductionBuild,
  loadProjectConfig,
  presetMotionDefaults,
  registryItemsForPreset,
  validateProjectConfig,
} from "./lib/project-config";
export type {
  ProjectConfig,
  ProjectMotionProfileName,
  ProjectPageTransition,
  ProjectPointerAccentBlendMode,
  ProjectPointerAccentConfig,
  ProjectPointerAccentEase,
  ProjectPointerAccentShape,
  ProjectPreset,
  ProjectRadiusPolicy,
  ProjectThemeMode,
  ProjectZIndexLayer,
  ValidateProjectConfigOptions,
} from "./lib/project-config";

export {
  canonicalUrl,
  createMetadata,
  createRobots,
  createSitemap,
  createWebManifest,
  jsonLdWebPage,
  jsonLdWebSite,
} from "./lib/seo";

export { ProjectProviders } from "./components/project-providers";
export type { ProjectProvidersProps } from "./components/project-providers";

export { SkipLink } from "./components/skip-link";
export { MainContent } from "./components/main-content";
export { SiteHeader } from "./components/site-header";
export { DesktopNavigation, TransitionLink } from "./components/desktop-navigation";
export { MobileNavigation } from "./components/mobile-navigation";
export { NavigationToggle } from "./components/navigation-toggle";
export type { SiteNavItem } from "./components/navigation-types";
export type { TransitionLinkProps } from "./components/transition-link";

export { RouteTransitionProvider } from "./components/route-transition-provider";
export { useRouteTransition } from "./components/use-route-transition";
export {
  MAIN_CONTENT_ID,
  ROUTE_TRANSITION_COVER_MS,
  ROUTE_TRANSITION_TIMEOUT_MS,
} from "./components/route-transition-types";
export type {
  RouteTransitionPhase,
  RouteTransitionRenderOverlay,
  RouteTransitionState,
} from "./components/route-transition-types";
export { classifyNavigation, shouldInterceptNavigation } from "./components/classify-navigation";
export type { ClassifyNavigationInput, NavigationKind } from "./components/classify-navigation";

export { ResponsiveImage } from "./components/responsive-image";
export type { ResponsiveImageProps } from "./components/responsive-image";
export { ResponsiveVideo } from "./components/responsive-video";
export type { ResponsiveVideoProps } from "./components/responsive-video";
export { MediaFrame } from "./components/media-frame";
export { AspectMedia } from "./components/aspect-media";

export { NotFoundFoundation } from "./components/not-found-foundation";
export { ErrorFoundation } from "./components/error-foundation";
