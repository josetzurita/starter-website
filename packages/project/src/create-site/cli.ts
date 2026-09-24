import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECT_PRESETS, type ProjectPreset } from "../lib/project-config";
import { createSite } from "./create-site";

function printHelp() {
  console.log(`Usage: pnpm create:site <name> --preset <minimal|creative|storytelling>

Options:
  --preset        Required install preset
  --url           Canonical URL written into project configuration
  --dest          Destination directory
  --skip-install  Copy the template without installing dependencies
`);
}

function readArg(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return argv[index + 1];
}

function hasFlag(argv: string[], flag: string): boolean {
  return argv.includes(flag);
}

function positionalName(argv: string[]): string | undefined {
  const valueFlags = new Set(["--preset", "--url", "--dest"]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg) continue;
    if (arg === "--skip-install" || arg === "--help" || arg === "-h") {
      continue;
    }
    if (valueFlags.has(arg)) {
      index += 1;
      continue;
    }
    if (arg.startsWith("-")) {
      continue;
    }
    return arg;
  }
  return undefined;
}

export function parseCreateSiteArgs(argv: string[]) {
  if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
    return { help: true as const };
  }
  const name = positionalName(argv);
  const preset = readArg(argv, "--preset");
  if (!name) {
    throw new Error("A project name is required.");
  }
  if (!preset || !PROJECT_PRESETS.includes(preset as ProjectPreset)) {
    throw new Error("Choose a preset: minimal, creative, or storytelling.");
  }
  return {
    help: false as const,
    name,
    preset: preset as ProjectPreset,
    canonicalUrl: readArg(argv, "--url"),
    dest: readArg(argv, "--dest"),
    skipInstall: hasFlag(argv, "--skip-install"),
  };
}

function repoRootFromCli() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
}

export function runCreateSiteCli(argv: string[], repoRoot = repoRootFromCli()) {
  const parsed = parseCreateSiteArgs(argv);
  if (parsed.help) {
    printHelp();
    return;
  }
  const result = createSite({
    name: parsed.name,
    preset: parsed.preset,
    canonicalUrl: parsed.canonicalUrl,
    dest: parsed.dest,
    skipInstall: parsed.skipInstall,
    repoRoot,
  });
  console.log(`Created ${result.preset} site at ${result.dest}`);
  console.log(`Registry items: ${result.registryItems.join(", ")}`);
  console.log("Next:");
  for (const command of result.nextCommands) {
    console.log(`  ${command}`);
  }
}

