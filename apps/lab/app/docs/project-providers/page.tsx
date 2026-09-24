import { PrimitiveDocs } from "../../../components/primitive-docs";
import { ProjectProvidersDemo } from "./project-providers-demo";

export default function ProjectProvidersDocsPage() {
  return (
    <PrimitiveDocs
      eyebrow="Production shell"
      title="ProjectProviders"
      intro="A single client leaf that composes MotionProvider, MotionProfileProvider, optional SmoothScrollProvider, optional RouteTransitionProvider, and optional PointerAccent. The root layout stays a Server Component."
      specimen={<ProjectProvidersDemo />}
      contract={[
        { name: "config", detail: "Validated ProjectConfig." },
        { name: "renderOverlay", detail: "Project-owned overlay slot. Unused when pageTransition is none." },
        { name: "pointerAccent.enabled", detail: "When true, mounts one PointerAccent. Native cursor stays visible." },
      ]}
      recommended="Wrap the document from a client Providers file imported by the server layout."
      avoid="Avoid a second Lenis instance or a second GSAP ticker."
      ownership="Motion owns reduced-motion config. Lenis owns wheel smoothing when enabled. The overlay controller owns navigation timing."
      reducedMotion="Smooth scroll and overlay collapse to native navigation."
      mobile="Touch keeps native scrolling. Overlay still honors reduced motion."
      performance="Features disable independently. Disabled providers do not mount Lenis."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/project-providers.json"
      usage={`<ProjectProviders config={projectConfig}>{children}</ProjectProviders>`}
      failures="Mounting SmoothScrollProvider twice creates two Lenis instances."
    />
  );
}
