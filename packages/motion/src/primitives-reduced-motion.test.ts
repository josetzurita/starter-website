import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

import { Reveal } from "./reveal";
import { Stagger, StaggerItem } from "./stagger";
import { ImageReveal } from "./image-reveal";

describe("primitives under reduced motion", () => {
  it("renders static Reveal, Stagger, and ImageReveal leaves", async () => {
    const rootEl = document.createElement("div");
    document.body.appendChild(rootEl);
    const root = createRoot(rootEl);
    await act(async () => {
      root.render(
        createElement(
          "div",
          null,
          createElement(Reveal, null, "Reveal copy"),
          createElement(
            Stagger,
            null,
            createElement(StaggerItem, null, "Item"),
          ),
          createElement(ImageReveal, null, createElement("img", { alt: "Specimen" })),
        ),
      );
    });
    expect(rootEl.textContent).toContain("Reveal copy");
    expect(rootEl.textContent).toContain("Item");
    expect(rootEl.querySelector("img")).toBeTruthy();
    await act(async () => {
      root.unmount();
    });
    rootEl.remove();
  });
});
