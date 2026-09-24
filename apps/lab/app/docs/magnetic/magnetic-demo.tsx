"use client";

import { Magnetic } from "@cds/motion";
import { Button } from "@cds/ui";
import { useState } from "react";

export function MagneticDemo() {
  const [count, setCount] = useState(0);

  return (
    <div data-testid="magnetic-live">
      <Magnetic>
        <Button
          data-testid="magnetic-button"
          onClick={() => {
            setCount((value) => value + 1);
          }}
        >
          Magnetic control
        </Button>
      </Magnetic>
      <p className="mt-3 font-mono text-xs text-foreground/55" data-testid="magnetic-count">
        Activations {count}
      </p>
    </div>
  );
}
