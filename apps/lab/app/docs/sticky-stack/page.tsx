import { PrimitiveDocs } from "../../../components/primitive-docs";
import { StickyStackDemo } from "./sticky-stack-demo";

export default function StickyStackDocsPage() {
  return (
    <PrimitiveDocs
      title="StickyStack"
      intro="GSAP ScrollTrigger pins each item at the top of the viewport. Outgoing items scale, fade, and optionally translate as the next item arrives. Children stay unstyled by the primitive."
      specimen={<StickyStackDemo />}
      contract={[
        { name: "scaleTo", detail: "Outgoing scale. Default 0.92. Clamped 0.5-1." },
        { name: "opacityTo", detail: "Outgoing opacity. Default 0.45. Clamped 0-1." },
        { name: "offset", detail: "Outgoing translateY in px. Default 0. Clamped 0-120." },
        { name: "scrub", detail: "true or lag seconds 0-2. Ease is none." },
        { name: "disableBelow", detail: "Vertical sequence below this width. Default 768." },
        { name: "debug", detail: "GSAP markers and boundary outlines." },
        { name: "StickyStackItem", detail: "One pin target. Arbitrary React children." },
      ]}
      recommended="Use when stacked specimens must occupy the same viewport slot and previous layers should recede as the next one arrives."
      avoid="Avoid for ordinary article flow, sticky chrome, or any case where pinning would trap focus or hide following content."
      ownership="GSAP owns pin, scale, opacity, and translateY on the inner layer. Do not tween those properties with Motion on the same node."
      reducedMotion="Static vertical sequence. No pin. No scrub."
      mobile="Normal vertical sequence below disableBelow. Touch scrolling stays native."
      performance="Classification: scroll-linked pin. One trigger per item plus one scrub per outgoing item. Kill on route change."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/sticky-stack.json"
      usage={`import { StickyStack, StickyStackItem } from "@cds/motion";

<StickyStack scaleTo={0.92} opacityTo={0.45}>
  <StickyStackItem>First</StickyStackItem>
  <StickyStackItem>Second</StickyStackItem>
</StickyStack>`}
      failures="Last-item pinSpacing is required or the stack never releases. Variable-height items can desync if images load after creation; the scene refreshes on image and font ready. Nested sticky CSS on children fights the pin."
    />
  );
}
