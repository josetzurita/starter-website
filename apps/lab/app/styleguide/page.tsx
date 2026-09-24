import { ButtonSection } from "./_components/button-section";
import { ColorSection } from "./_components/color-section";
import { ComponentSection } from "./_components/component-section";
import { ContainerSection } from "./_components/container-section";
import { FormSection } from "./_components/form-section";
import { MotionSection } from "./_components/motion-section";
import { PointerAccentStyleguide } from "./_components/pointer-accent-section";
import { RadiusSection } from "./_components/radius-section";
import { SpacingSection } from "./_components/spacing-section";
import { StyleguideSection } from "./_components/styleguide-section";
import { TypographySection } from "./_components/typography-section";
import { STYLEGUIDE_SECTIONS } from "./_data/styleguide-data";

export default function StyleguidePage() {
  return (
    <div className="content-full min-w-0 overflow-x-clip py-16">
      <StyleguideSection
        description="Internal specimen for how CDS is used in the catalogue. Layout matches generated client sites. Tokens, Geist, graphite, and tungsten stay Lab."
        headingLevel="h1"
        id="overview"
        title="CDS Lab"
      >
        <p className="max-w-[65ch] text-foreground/75">
          Internal component and interaction catalogue for creative developers.
          The lab is a technical specimen, not a generic SaaS dashboard.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Theme</dt>
            <dd className="mt-1 text-sm">Lab tokens / system</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Motion profile</dt>
            <dd className="mt-1 text-sm">house</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Smooth scroll</dt>
            <dd className="mt-1 text-sm">enabled</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Pointer Accent</dt>
            <dd className="mt-1 text-sm">specimen. not site-wide</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Radius policy</dt>
            <dd className="mt-1 text-sm">standard 4 / 6 / 8</dd>
          </div>
          <div className="border-t border-border pt-3">
            <dt className="type-label text-foreground/55">Type</dt>
            <dd className="mt-1 text-sm">Geist / Geist Mono</dd>
          </div>
        </dl>
        <nav aria-label="Styleguide sections" className="mt-10 border-t border-border pt-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {STYLEGUIDE_SECTIONS.map((section) => (
              <li key={section.href}>
                <a className="underline-offset-4 hover:underline" href={section.href}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </StyleguideSection>

      <TypographySection />
      <ColorSection />
      <ButtonSection />
      <FormSection />
      <ContainerSection />
      <SpacingSection />
      <RadiusSection />
      <MotionSection />
      <PointerAccentStyleguide />
      <ComponentSection />
    </div>
  );
}
