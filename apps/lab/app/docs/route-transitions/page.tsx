import { PrimitiveDocs } from "../../../components/primitive-docs";
import { RouteTransitionsDemo } from "./route-transitions-demo";

export default function RouteTransitionsDocsPage() {
  return (
    <PrimitiveDocs
      eyebrow="Production shell"
      title="Route transitions"
      intro="Optional overlay navigation. The controller owns timing, recovery, Lenis stop/start, and focus. The project owns overlay visuals. Anchors are not intercepted globally."
      specimen={<RouteTransitionsDemo />}
      contract={[
        { name: "mode", detail: "none or overlay, from project configuration." },
        { name: "renderOverlay", detail: "Slot for project visuals. Opacity and transform only." },
        { name: "timeout", detail: "Uncovers after 8000ms if navigation never completes." },
      ]}
      recommended="Use overlay only when a cover is part of the project's language."
      avoid="Avoid multiple branded transition packs. Avoid leaving the cover up after failure."
      ownership="The controller calls router.push after cover. GSAP ScrollTrigger refreshes after settle."
      reducedMotion="Overlay is skipped. Navigation is native."
      mobile="The same controller. No extra gesture layer."
      performance="One timeout. No scroll listeners."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/route-transitions.json"
      usage={`<RouteTransitionProvider renderOverlay={(state) => <Overlay {...state} />}>`}
      failures="If router.push never changes the pathname, the timeout returns the page to idle."
    />
  );
}
