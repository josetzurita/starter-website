import { PrimitiveDocs } from "../../../components/primitive-docs";
import { PointerAccentDemo } from "./pointer-accent-demo";

export default function PointerAccentDocsPage() {
  return (
    <PrimitiveDocs
      eyebrow="Production shell"
      title="PointerAccent"
      intro="A GSAP-driven follower that lags, stretches with velocity, and grows over marked targets. It never hides or replaces the native operating-system cursor."
      specimen={<PointerAccentDemo />}
      contract={[
        { name: "enabled", detail: "Feature flag. Off until the project turns it on." },
        { name: "size, color, opacity, shape", detail: "Client-owned visuals. circle, square, or ring." },
        { name: "lag, ease", detail: "Outer follow timing. Ease may be a motion-profile intent or a GSAP string." },
        { name: "stretch, maxStretch", detail: "Inner velocity deformation and its clamp." },
        { name: "hoverGrow, hoverSelectors, textSelectors, hoverScaleMax", detail: "Delegated cover scale. Text targets must opt in with data-pointer-accent-text." },
        { name: "offsetX, offsetY, blendMode, zIndex", detail: "Alignment, blend, and z-index token." },
      ]}
      recommended="Use as a supplement on fine-pointer desktops when the project wants a kinetic accent. Difference blend belongs to the project specimen, not the package default."
      avoid="Do not set cursor none. Do not use Magnetic. Do not store pointer coordinates in React state. Do not add a second requestAnimationFrame loop. Do not animate width or height."
      ownership="Outer GSAP node owns x, y, hover cover via scaleX and scaleY, and opacity. Inner node owns rotation and stretch via scaleX and scaleY. The operating system owns the cursor."
      reducedMotion="The node is not rendered."
      mobile="Touch and coarse pointers never render it."
      performance="Pointermove and delegated pointerover drive quickTo on the shared GSAP ticker. Two nodes. Passive listeners. Cleanup kills tweens."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/pointer-accent.json"
      usage={`import { PointerAccent } from "@cds/motion";

<PointerAccent
  enabled
  size={14}
  color="oklch(0.97 0.004 250)"
  blendMode="difference"
  lag={0.4}
  ease="power3.out"
  hoverGrow
  hoverScaleMax={1.5}
/>`}
      failures="Enabling it on a minimal project by default. Hiding the native cursor. Animating width or height. Attaching hover listeners to every paragraph."
    />
  );
}
