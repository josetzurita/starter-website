const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

export function validateProjectName(name: string): string {
  const value = name.trim();
  if (!value) {
    throw new Error("Project name is required.");
  }
  if (value.length > 64) {
    throw new Error("Project name must be 64 characters or fewer.");
  }
  if (!NAME_PATTERN.test(value) || value.includes("--") || value.endsWith("-")) {
    throw new Error(
      "Project name must be a lowercase kebab-case identifier starting with a letter.",
    );
  }
  return value;
}

export function titleFromName(name: string): string {
  return name
    .split("-")
    .map((part) => {
      const first = part.charAt(0);
      return `${first.toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");
}
