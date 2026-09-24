import { PrimitiveDocs } from "../../../components/primitive-docs";
import { ImageRevealDemo } from "./image-reveal-demo";

export default function ImageRevealDocsPage() {
  return (
    <PrimitiveDocs
      title="ImageReveal"
      intro="Overflow clip around intrinsic media. The inner node translates (and optionally scales) into view."
      specimen={<ImageRevealDemo />}
      contract={[
        { name: "direction", detail: "up, down, left, or right. Default up." },
        { name: "scale", detail: "Optional inner scale at rest of the tween. Clamped 1-1.08." },
        { name: "once", detail: "Play on first intersection. Default true." },
        { name: "amount", detail: "Viewport amount. Default 0.3." },
        { name: "intent", detail: "Profile easing intent. Default settle." },
        { name: "ease", detail: "Raw cubic Bézier override. Optional escape hatch." },
      ]}
      recommended="A single image or graphic whose layout already exists. Pass width and height on the media."
      avoid="Do not set radius or aspect ratio on this primitive. Do not animate the img width or height."
      ownership="Motion owns transform (and optional opacity) on the inner node. The overflow wrapper is static CSS."
      reducedMotion="Media shows immediately with no clip tween."
      mobile="Clip still works. Prefer up/down so horizontal overflow is not introduced."
      performance="Classification: compositor. One inner transformed node plus overflow. Cheap."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/image-reveal.json"
      usage={`import { ImageReveal } from "@cds/motion";

<ImageReveal direction="up" scale={1.04}>
  <img alt="Specimen" src="/specimen.svg" width={640} height={360} />
</ImageReveal>`}
    />
  );
}
