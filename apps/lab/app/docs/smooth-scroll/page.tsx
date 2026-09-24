import { PrimitiveDocs } from "../../../components/primitive-docs";
import { SmoothScrollDemo } from "./smooth-scroll-demo";

export default function SmoothScrollDocsPage() {
  return (
    <PrimitiveDocs
      title="SmoothScroll"
      intro="One app-level Lenis instance. GSAP ticker is the only RAF source. ScrollTrigger updates on Lenis scroll. Individual primitives never create Lenis."
      specimen={<SmoothScrollDemo />}
      contract={[
        { name: "lerp", detail: "Conservative default 0.1. Lower is snappier." },
        { name: "anchors", detail: "true. In-page hash links go through Lenis scrollTo." },
        { name: "stopInertiaOnNavigate", detail: "true. Internal navigation drops leftover lerp." },
        { name: "syncTouch", detail: "false. Touch stays native." },
        { name: "autoRaf", detail: "false. gsap.ticker calls lenis.raf(time * 1000)." },
        { name: "prevent", detail: "data-lenis-prevent, Radix dialog content, role=dialog." },
        { name: "useSmoothScroll", detail: "lenis, mode, scrollTo, start, stop, resize. Outside the provider, lenis is null and window scrolling is used." },
      ]}
      recommended="Mount SmoothScrollProvider once next to MotionProvider. Mark nested overflow and dialogs with data-lenis-prevent."
      avoid="Do not instantiate Lenis in a primitive. Do not add a second requestAnimationFrame loop. Do not reset scroll on every pathname change. Do not call stop() in a way that fights Radix body lock."
      ownership="Lenis owns document wheel smoothing in smooth mode. GSAP ticker owns RAF. ScrollTrigger consumes Lenis scroll updates. Motion still owns transform and opacity on UI primitives. Future pin and scrub stay on GSAP, not on this provider."
      reducedMotion="Mode is reduced-motion. No Lenis instance. Native scrolling and instant programmatic jumps."
      mobile="Mode is native-touch. Touch scrolling stays native. Keyboard still scrolls the document."
      performance="Classification: scroll-linked. One ticker callback for the whole app. Nested prevent avoids DOM-wide allowNestedScroll."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/smooth-scroll.json"
      usage={`import { SmoothScrollProvider, useSmoothScroll } from "@cds/motion";

<MotionProvider>
  <SmoothScrollProvider>{children}</SmoothScrollProvider>
</MotionProvider>

const { scrollTo, mode } = useSmoothScroll();
scrollTo("#nested-scroll");`}
    />
  );
}
