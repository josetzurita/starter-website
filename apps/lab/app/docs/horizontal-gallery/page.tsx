import { PrimitiveDocs } from "../../../components/primitive-docs";
import { HorizontalGalleryDemo } from "./horizontal-gallery-demo";

export default function HorizontalGalleryDocsPage() {
  return (
    <PrimitiveDocs
      title="HorizontalGallery"
      intro="Vertical document scroll drives horizontal travel. The wrapper pins when its top hits the top of the viewport, then the track translates by track width minus wrapper width. Frames will not move while the section is still mid-screen. Item design stays with the project."
      specimen={<HorizontalGalleryDemo />}
      contract={[
        { name: "scrub", detail: "true or lag seconds 0-2. Ease is none." },
        { name: "disableBelow", detail: "Native horizontal swipe below this width. Default 768." },
        { name: "debug", detail: "GSAP markers and boundary outlines." },
        { name: "HorizontalGalleryItem", detail: "Variable-width child. No prescribed size." },
        { name: "trackClassName", detail: "Optional class on the translating track." },
      ]}
      recommended="Use for a horizontal sequence that should map to vertical document scroll on desktop."
      avoid="Avoid when the content is a native carousel, when items need independent page URLs, or when the track is shorter than the viewport."
      ownership="GSAP owns the track transform and the wrapper pin. Overflow is clipped on the wrapper so the document does not grow sideways."
      reducedMotion="No pin. Track stacks vertically. All items remain reachable."
      mobile="Native overflow-x swipe. No pin. Touch scrolling stays on the track."
      performance="Classification: scroll-linked pin plus one transform. invalidateOnRefresh after fonts, images, and viewport changes."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/horizontal-gallery.json"
      usage={`import { HorizontalGallery, HorizontalGalleryItem } from "@cds/motion";

<HorizontalGallery className="min-h-[100dvh]">
  <HorizontalGalleryItem className="min-h-[100dvh] w-full">
    One
  </HorizontalGalleryItem>
  <HorizontalGalleryItem className="min-h-[100dvh] w-full">
    Two
  </HorizontalGalleryItem>
</HorizontalGallery>`}
      failures="If overflow is not clipped, the document grows horizontally. Images that load late change travel; refresh on load. Pinning the track node instead of the wrapper animates the pinned element and jitters."
    />
  );
}
