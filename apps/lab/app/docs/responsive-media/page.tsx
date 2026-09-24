import { PrimitiveDocs } from "../../../components/primitive-docs";
import { ResponsiveMediaDemo } from "./responsive-media-demo";

export default function ResponsiveMediaDocsPage() {
  return (
    <PrimitiveDocs
      eyebrow="Production shell"
      title="Responsive media"
      intro="Intrinsic-dimension media primitives. The project chooses width, height, sizes, and fallback. The shell does not assign an aspect ratio family or a radius."
      specimen={<ResponsiveMediaDemo />}
      contract={[
        { name: "ResponsiveImage", detail: "Requires alt and intrinsic width/height." },
        { name: "ResponsiveVideo", detail: "Autoplay only when muted and motion is allowed." },
        { name: "AspectMedia", detail: "Aspect ratio from the provided width and height." },
      ]}
      recommended="Use when layout must not shift while media resolves."
      avoid="Avoid a global 16:9 utility as the primitive default."
      ownership="next/image owns decoding. The video element owns playback."
      reducedMotion="Autoplay is suppressed. The poster remains."
      mobile="sizes is the project's responsibility."
      performance="Lazy by default unless priority is set."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/responsive-media.json"
      usage={`<ResponsiveImage alt="Work" src={src} width={1600} height={900} sizes="100vw" />`}
      failures="A missing width and height lets the image shift the layout."
    />
  );
}
