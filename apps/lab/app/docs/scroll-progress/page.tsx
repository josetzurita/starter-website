import { PrimitiveDocs } from "../../../components/primitive-docs";
import { ScrollProgressDemo } from "./scroll-progress-demo";

export default function ScrollProgressDocsPage() {
  return (
    <PrimitiveDocs
      title="ScrollProgress"
      intro="Page reading progress as a scale transform. Semantic accent fill and the sticky z-index token. Container scope is experimental."
      specimen={<ScrollProgressDemo />}
      contract={[
        { name: "axis", detail: "x draws a top bar with scaleX. y draws a side bar with scaleY. Progress still tracks document scroll." },
        { name: "scope", detail: "page (default) or experimental container." },
        { name: "containerRef", detail: "Experimental. Required when scope is container." },
        { name: "className", detail: "Override semantic track classes. Default bg-accent and z-[var(--z-sticky)]." },
      ]}
      recommended="A single page-level bar. Keep it pointer-events none."
      avoid="Do not listen to window scroll. Do not animate width or height. Treat container scope as experimental."
      ownership="Motion owns scaleX or scaleY on the bar. Position is CSS (fixed). GSAP must not tween that transform."
      reducedMotion="The bar renders at full scale and stays static."
      mobile="Fixed bar still tracks document scroll. Keep it 2px so it does not steal space."
      performance="Classification: scroll-linked compositor. One node for the whole page."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/scroll-progress.json"
      usage={`import { ScrollProgress } from "@cds/motion";

<ScrollProgress />
<ScrollProgress axis="y" />`}
    />
  );
}
