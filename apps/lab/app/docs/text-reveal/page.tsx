import { PrimitiveDocs } from "../../../components/primitive-docs";
import { TextRevealDemo } from "./text-reveal-demo";

export default function TextRevealDocsPage() {
  return (
    <PrimitiveDocs
      title="TextReveal"
      intro="Word or explicit-line entrance. The source string stays available to assistive technology once. Animated fragments are hidden."
      specimen={<TextRevealDemo />}
      contract={[
        { name: "text", detail: "Canonical accessible string. Required." },
        { name: "mode", detail: "words or lines. Default words. Lines do not measure the box." },
        { name: "lines", detail: "Explicit visual lines when mode is lines." },
        { name: "interval", detail: "Stagger between fragments. Default profile stagger.normal (0.065)." },
        { name: "as", detail: "Semantic host. Default p." },
      ]}
      recommended="Headlines and short statements where you already know the line breaks."
      avoid="Do not auto-measure visual lines. Do not put typography styles in the primitive. Do not animate body copy at paragraph scale."
      ownership="Motion owns opacity and transform on fragment spans. The accessible string is not animated."
      reducedMotion="Renders the accessible string as static text with no fragment tree."
      mobile="Same intersection contract. Keep copy short so wrapping does not feel like a second animation."
      performance="Classification: many-nodes. Each word is a node. Use on short strings only."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/text-reveal.json"
      usage={`import { TextReveal } from "@cds/motion";

<TextReveal text="One accessible string." />

<TextReveal
  mode="lines"
  text="Line one Line two"
  lines={["Line one", "Line two"]}
/>`}
    />
  );
}
