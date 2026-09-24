"use client";

import {
  MainContent,
  SiteHeader,
  SkipLink,
  TransitionLink,
} from "@cds/project";

const items = [
  { href: "/docs/site-navigation", label: "Navigation" },
  { href: "/docs/route-transitions", label: "Transitions" },
];

export function SiteNavigationDemo() {
  return (
    <div
      data-testid="site-navigation-live"
      className="overflow-hidden border border-border"
    >
      <SkipLink />
      <SiteHeader
        items={items}
        brand={
          <TransitionLink href="/docs/site-navigation" className="text-sm">
            Specimen
          </TransitionLink>
        }
      />
      <MainContent className="px-4 py-6">
        <p className="text-sm">
          Desktop stays on one line. Resize below 768px and use the toggle.
          Escape closes the dialog. Current page uses aria-current.
        </p>
        <a className="mt-4 inline-block text-sm underline" href="#after-nav">
          Hash target
        </a>
        <p id="after-nav" className="mt-16 text-sm">
          Hash landing.
        </p>
      </MainContent>
    </div>
  );
}
