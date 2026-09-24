import { PrimitiveDocs } from "../../../components/primitive-docs";
import { StaggerDemo } from "./stagger-demo";

export default function StaggerDocsPage() {
  return (
    <PrimitiveDocs
      title="Stagger"
      intro="Viewport stagger for sibling items using Motion variants. Interval, delay, and semantic hosts are props."
      specimen={<StaggerDemo />}
      contract={[
        { name: "interval", detail: "Seconds between children. Default profile stagger.normal (0.065). Clamped 0-1." },
        { name: "delay", detail: "Initial delayChildren in seconds. Default 0." },
        { name: "amount", detail: "Viewport amount passed to whileInView. Default 0.3." },
        { name: "once", detail: "Play on first intersection only. Default true." },
        { name: "as", detail: "Semantic element for Stagger and StaggerItem. Default div." },
        { name: "intent", detail: "StaggerItem easing intent. Default enter." },
      ]}
      recommended="Lists, stacked catalogue rows, and short groups of sibling reveals."
      avoid="Do not stagger hundreds of nodes. Do not mix GSAP tweens on the same opacity or transform."
      ownership="Motion owns opacity and transform on the stagger host and each item. GSAP must not tween those properties on the same nodes."
      reducedMotion="useReducedMotion renders static semantic elements with no variants."
      mobile="Intersection still runs. Keep intervals short. Touch does not change the contract."
      performance="Classification: compositor for a small set of nodes. Many-nodes if the list is long. Prefer fewer than a dozen items."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/stagger.json"
      usage={`import { Stagger, StaggerItem } from "@cds/motion";

<Stagger as="ul">
  <StaggerItem as="li">One</StaggerItem>
  <StaggerItem as="li">Two</StaggerItem>
</Stagger>`}
    />
  );
}
