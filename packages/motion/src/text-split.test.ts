import { describe, expect, it } from "vitest";
import {
  accessibleTextFromLines,
  joinTextParts,
  splitTextParts,
} from "./text-split";

describe("text split", () => {
  it("preserves spaces and punctuation on words", () => {
    const parts = splitTextParts("Hello, world.");
    expect(joinTextParts(parts)).toBe("Hello, world.");
    expect(parts.map((part) => part.type)).toEqual(["word", "space", "word"]);
    expect(parts[0]?.value).toBe("Hello,");
    expect(parts[2]?.value).toBe("world.");
  });

  it("keeps the accessible string identical to source text", () => {
    const source = "Opacity and transform only.";
    expect(joinTextParts(splitTextParts(source))).toBe(source);
  });

  it("prefers explicit text for the accessible lines string", () => {
    expect(
      accessibleTextFromLines("One string.", ["One", "string."]),
    ).toBe("One string.");
    expect(accessibleTextFromLines(undefined, ["One", "string."])).toBe(
      "One string.",
    );
  });
});
