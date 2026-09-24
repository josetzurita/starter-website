import { existsSync, readdirSync, statSync } from "node:fs";

export function assertDestinationAvailable(dest: string) {
  if (!existsSync(dest)) {
    return;
  }
  if (!statSync(dest).isDirectory()) {
    throw new Error(`Destination exists and is not a directory: ${dest}`);
  }
  const entries = readdirSync(dest).filter((entry) => entry !== "." && entry !== "..");
  if (entries.length > 0) {
    throw new Error(`Refusing to overwrite a non-empty destination: ${dest}`);
  }
}
