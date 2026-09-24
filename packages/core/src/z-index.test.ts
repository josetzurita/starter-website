import { describe, expect, it } from "vitest";
import { zIndex } from "./z-index";

describe("zIndex", () => {
  it("keeps layers in documented order", () => {
    expect(zIndex.base).toBe(0);
    expect(zIndex.raised).toBe(10);
    expect(zIndex.sticky).toBe(20);
    expect(zIndex.overlay).toBe(30);
    expect(zIndex.dialog).toBe(40);
    expect(zIndex.toast).toBe(50);
    expect(zIndex.debug).toBe(60);
  });
});
