import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

export const metadata = createMetadata(projectConfig, {
  title: "Work",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div className="px-6 py-16">
      <h1 className="text-3xl font-medium tracking-tight">Work</h1>
      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-foreground/75">
        A second route so TransitionLink, metadata, and the document shell can
        be verified. Replace this copy with project work.
      </p>
    </div>
  );
}
