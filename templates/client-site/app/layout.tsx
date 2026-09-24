import type { Metadata } from "next";
import { MainContent } from "../components/main-content";
import { SiteHeader } from "../components/site-header";
import { SkipLink } from "../components/skip-link";
import { TransitionLink } from "../components/transition-link";
import { createMetadata, jsonLdWebSite } from "../lib/seo";
import { htmlLang, htmlThemeDataset } from "../lib/project-config";
import { projectConfig } from "../project.config";
import { Providers } from "./providers";
import "./globals.css";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
];

export const metadata: Metadata = createMetadata(projectConfig);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={htmlLang(projectConfig)}
      data-theme={htmlThemeDataset(projectConfig)}
      data-radius={projectConfig.theme.radius}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite(projectConfig)),
          }}
        />
        <Providers config={projectConfig}>
          <SkipLink />
          <SiteHeader
            items={nav}
            brand={
              <TransitionLink href="/" className="text-sm font-medium">
                {projectConfig.site.name}
              </TransitionLink>
            }
          />
          <MainContent>{children}</MainContent>
        </Providers>
      </body>
    </html>
  );
}
