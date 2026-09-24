import { PrimitiveDocs } from "../../../components/primitive-docs";
import { ParallaxDemo } from "./parallax-demo";

export default function ParallaxDocsPage() {
  return (
    <PrimitiveDocs
      title="Parallax"
      intro="Clamped scroll-linked translate using Motion useScroll and useTransform. Optional breakpoint disable."
      specimen={<ParallaxDemo />}
      contract={[
        { name: "speed", detail: "Unitless speed. Default 0.2. Clamped 0-0.45." },
        { name: "disableBelow", detail: "Disable when viewport is narrower than this pixel width." },
        { name: "as", detail: "Host element. Default div. Transform is owned on this node." },
      ]}
      recommended="Small atmospheric offsets on media or a caption block. Keep travel modest."
      avoid="Do not attach GSAP to this node's transform. Do not use for layout (no top or height). Do not run large speeds."
      ownership="Motion owns transform on the Parallax host. GSAP and Motion must not tween the same property on that node."
      reducedMotion="Travel maps to zero. Content stays in place."
      mobile="disableBelow can turn it off on small screens. Touch scrolling still drives useScroll when enabled."
      performance="Classification: scroll-linked compositor. One transformed node. Safe when speed stays clamped."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/parallax.json"
      usage={`import { Parallax } from "@cds/motion";

<Parallax speed={0.2} disableBelow={768}>
  <img alt="Specimen" src="/specimen.svg" />
</Parallax>`}
    />
  );
}
