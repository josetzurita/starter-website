import { PrimitiveDocs } from "../../../components/primitive-docs";
import { ProjectConfigDemo } from "./project-config-demo";

export default function ProjectConfigDocsPage() {
  return (
    <PrimitiveDocs
      eyebrow="Production shell"
      title="ProjectConfig"
      intro="Typed identity for a generated client site. Validation runs in development and production. Missing canonical URLs, locales, or feature flags fail the build instead of being invented."
      specimen={<ProjectConfigDemo />}
      contract={[
        { name: "site", detail: "name, shortName, description, locale, canonicalUrl." },
        { name: "theme", detail: "mode light, dark, or system. radius sm, md, or lg." },
        { name: "motion", detail: "house profile, smoothScroll boolean, pageTransition none or overlay." },
        { name: "features", detail: "analytics and cms booleans. No vendor SDKs." },
        { name: "pointerAccent", detail: "enabled flag plus size, color, opacity, shape, lag, ease, stretch, offsets, blendMode, and z-index token." },
      ]}
      recommended="Use as the only source of production identity, locale, and feature flags."
      avoid="Avoid defaulting a production canonical URL to localhost or a fake company."
      ownership="Plain TypeScript. No React state. The root layout stays a Server Component."
      reducedMotion="Configuration is data. It does not animate."
      mobile="The same object is valid on every viewport."
      performance="Validate once at module load."
      install="pnpm dlx shadcn@latest add ./apps/registry/public/r/project-config.json"
      usage={`import { loadProjectConfig } from "@cds/project";

export const projectConfig = loadProjectConfig(input);`}
      failures="An empty canonicalUrl throws. Production rejects public http origins."
    />
  );
}
