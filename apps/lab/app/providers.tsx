"use client";

import { MotionProfileProvider } from "@cds/motion/motion-profile-provider";
import { MotionProvider } from "@cds/motion/motion-provider";
import { SmoothScrollProvider } from "@cds/motion/smooth-scroll-provider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <MotionProfileProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </MotionProfileProvider>
    </MotionProvider>
  );
}
