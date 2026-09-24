import { PrimitiveDocs } from "../../../components/primitive-docs";
import { MagneticDemo } from "./magnetic-demo";

export default function MagneticDocsPage() {
  return (
    <PrimitiveDocs
      title="Magnetic"
      intro="Fine-pointer offset using motion values and a spring return. Click, focus, and keyboard on children stay intact."
      specimen={<MagneticDemo />}
      contract={[
        { name: "strength", detail: "Pointer follow amount. Default 0.35. Clamped 0-1." },
        { name: "maxOffset", detail: "Pixel clamp. Default 16. Clamped 0-32." },
        { name: "as", detail: "Wrapper element. Default div. Do not wrap a button in a button." },
      ]}
      recommended="Small controls that already have a hover affordance. Keep the child as the interactive element."
      avoid="Do not enable on touch. Do not store pointer coordinates in React state. Do not use as a custom cursor."
      ownership="Motion values own transform on the wrapper. Children own click and keyboard. GSAP must not tween this wrapper transform."
      reducedMotion="No displacement. The control still clicks and focuses."
      mobile="Coarse pointers and touch never displace. The inner control remains tappable."
      performance="Classification: pointer compositor. Cheap if limited to a few controls. Do not paint dozens."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/magnetic.json"
      usage={`import { Magnetic } from "@cds/motion";

<Magnetic>
  <button type="button">Open</button>
</Magnetic>`}
    />
  );
}
