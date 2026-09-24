"use client";

import { Stagger, StaggerItem } from "@cds/motion";

export function StaggerDemo() {
  return (
    <div data-testid="stagger-live">
      <Stagger className="grid gap-3" as="ul">
        <StaggerItem as="li" className="border-t border-border pt-3">
          First specimen row
        </StaggerItem>
        <StaggerItem as="li" className="border-t border-border pt-3">
          Second specimen row
        </StaggerItem>
        <StaggerItem as="li" className="border-t border-border pt-3">
          Third specimen row
        </StaggerItem>
      </Stagger>
    </div>
  );
}
