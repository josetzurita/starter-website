import { TransitionLink } from "@/components/transition-link";
import { projectConfig } from "@/project.config";

export default function HomePage() {
  return (
    <div className="px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Architecture specimen
      </p>
      <h1 className="mt-4 max-w-[20ch] text-4xl font-medium tracking-tight">
        {projectConfig.site.name}
      </h1>
      <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-foreground/75">
        {projectConfig.site.description} This route exists to prove the
        production shell, not to ship a finished marketing page.
      </p>
      <p className="mt-6 text-sm text-foreground/70">
        Smooth scroll is {projectConfig.motion.smoothScroll ? "on" : "off"}.
        Page transition is {projectConfig.motion.pageTransition}. Analytics and
        CMS flags stay off until a real vendor is chosen.
      </p>
      <TransitionLink href="/work" className="mt-8 inline-block text-sm underline">
        Secondary route
      </TransitionLink>
    </div>
  );
}
