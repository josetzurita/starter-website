import { PrimitiveDocs } from "../../../components/primitive-docs";
import { SiteNavigationDemo } from "./site-navigation-demo";

export default function SiteNavigationDocsPage() {
  return (
    <PrimitiveDocs
      eyebrow="Production shell"
      title="Site navigation"
      intro="Structural chrome: SkipLink, MainContent, SiteHeader, DesktopNavigation, MobileNavigation, NavigationToggle, and TransitionLink. No logo treatment and no magnetic pointer effects."
      specimen={<SiteNavigationDemo />}
      contract={[
        { name: "items", detail: "href plus label. Current page is pathname equality." },
        { name: "brand", detail: "Project-owned slot. The shell does not draw a mark." },
      ]}
      recommended="Use for document chrome that must stay keyboard accessible."
      avoid="Avoid intercepting every anchor on the document. Use TransitionLink only."
      ownership="Radix owns the mobile dialog, focus trap, and Escape. Next.js owns routing."
      reducedMotion="No decorative motion in the chrome."
      mobile="Dialog overlay uses data-lenis-prevent. Escape closes it."
      performance="Header is one client leaf."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/site-navigation.json"
      usage={`<SiteHeader brand={<Link href="/">Name</Link>} items={items} />`}
      failures="Missing MainContent id breaks SkipLink."
    />
  );
}
