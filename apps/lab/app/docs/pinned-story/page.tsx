import { PrimitiveDocs } from "../../../components/primitive-docs";
import { PinnedStoryDemo } from "./pinned-story-demo";

export default function PinnedStoryDocsPage() {
  return (
    <PrimitiveDocs
      title="PinnedStory"
      intro="Pin a project-owned visual while steps move through the document. Discrete activeIndex may use React state. Frame progress stays on a motion value."
      specimen={<PinnedStoryDemo />}
      contract={[
        { name: "steps", detail: "Data array. The primitive does not assume media types." },
        { name: "renderVisual", detail: "activeIndex, steps, frameProgress, sceneProgress, progressRef." },
        { name: "renderStep", detail: "step, index, isActive, steps." },
        { name: "onActiveIndexChange", detail: "Discrete index callback." },
        { name: "onFrameProgress", detail: "Scroll-linked callback. Do not copy into useState." },
        { name: "disableBelow", detail: "Place each visual beside its step below this width." },
        { name: "debug", detail: "GSAP markers and boundary outlines." },
      ]}
      recommended="Use for scrollytelling where a visual should hold while copy advances, and the project owns the crossfade."
      avoid="Avoid when every step needs a unique URL, when the visual is the only content, or when a CSS sticky column is enough."
      ownership="GSAP owns the visual pin and step triggers. Motion may own discrete visual transitions inside renderVisual. Do not store frame progress in React state."
      reducedMotion="Static. Every visual sits with its step. No pin."
      mobile="Each visual renders next to its corresponding step. No pin."
      performance="Classification: scroll-linked pin plus one trigger per step. Progress writes to a motion value."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/pinned-story.json"
      usage={`import { PinnedStory } from "@cds/motion";

<PinnedStory
  steps={steps}
  renderVisual={({ activeIndex, frameProgress }) => (
    <Panel index={activeIndex} progress={frameProgress} />
  )}
  renderStep={({ step }) => <Copy title={step.title} />}
/>`}
      failures="Pinning the visual without pinSpacing false can double the section height. Updating React state from onFrameProgress will hitch. Late images still require ScrollTrigger.refresh."
    />
  );
}
