export type TextPart = {
  type: "word" | "space";
  value: string;
};

export function splitTextParts(text: string): TextPart[] {
  return text
    .split(/(\s+)/)
    .filter((value) => value.length > 0)
    .map((value) => ({
      type: /^\s+$/.test(value) ? "space" : "word",
      value,
    }));
}

export function joinTextParts(parts: TextPart[]): string {
  return parts.map((part) => part.value).join("");
}

export function accessibleTextFromLines(
  text: string | undefined,
  lines: string[],
): string {
  if (text != null && text.length > 0) {
    return text;
  }
  return lines.join(" ");
}
