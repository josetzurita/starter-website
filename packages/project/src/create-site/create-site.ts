import { spawnSync, type SpawnSyncOptions } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  createPresetProjectConfig,
  registryItemsForPreset,
  type ProjectConfig,
  type ProjectPreset,
} from "../lib/project-config";
import { assertDestinationAvailable } from "./validate-destination";
import { titleFromName, validateProjectName } from "./validate-name";

export type CreateSiteOptions = {
  name: string;
  preset: ProjectPreset;
  cwd?: string;
  dest?: string;
  canonicalUrl?: string;
  skipInstall?: boolean;
  skipTypecheck?: boolean;
  repoRoot: string;
  run?: typeof runProcess;
};

export type CreateSiteResult = {
  dest: string;
  name: string;
  preset: ProjectPreset;
  config: ProjectConfig;
  registryItems: string[];
  nextCommands: string[];
};

function runProcess(
  command: string,
  args: string[],
  options: SpawnSyncOptions,
) {
  const result = spawnSync(command, args, {
    ...options,
    stdio: options.stdio ?? "inherit",
    // Windows resolves .cmd shims only when shell is enabled. Arguments stay an array.
    shell: process.platform === "win32",
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
  return result;
}

function pnpmCommand(): { command: string; prefix: string[] } {
  const probe = spawnSync("pnpm", ["--version"], {
    encoding: "utf8",
    shell: process.platform === "win32",
    windowsHide: true,
  });
  if (probe.status === 0) {
    return { command: "pnpm", prefix: [] };
  }
  return { command: "npx", prefix: ["--yes", "pnpm@10.15.0"] };
}

export function renderProjectConfigModule(config: ProjectConfig): string {
  return `import { loadProjectConfig, type ProjectConfig } from "./lib/project-config";

const input = ${JSON.stringify(config, null, 2)} as const satisfies ProjectConfig;

export const projectConfig = loadProjectConfig(input);
`;
}

export function createSite(options: CreateSiteOptions): CreateSiteResult {
  const run = options.run ?? runProcess;
  const name = validateProjectName(options.name);
  const cwd = options.cwd ?? process.cwd();
  const dest = path.resolve(options.dest ?? path.join(cwd, name));
  const canonicalUrl = options.canonicalUrl ?? "http://127.0.0.1:3000";
  const templateDir = path.join(options.repoRoot, "templates", "client-site");
  const registryDir = path.join(options.repoRoot, "apps", "registry", "public", "r");

  if (!existsSync(templateDir)) {
    throw new Error(`Template is missing at ${templateDir}`);
  }

  assertDestinationAvailable(dest);
  mkdirSync(dest, { recursive: true });

  cpSync(templateDir, dest, {
    recursive: true,
    filter: (src) => {
      const normalized = src.replaceAll("\\", "/");
      return !normalized.includes("/node_modules") && !normalized.includes("/.next");
    },
  });

  const pkgPath = path.join(dest, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { name?: string };
  pkg.name = name;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const config = createPresetProjectConfig({
    name,
    title: titleFromName(name),
    preset: options.preset,
    canonicalUrl,
  });
  writeFileSync(path.join(dest, "project.config.ts"), renderProjectConfigModule(config));
  writeFileSync(
    path.join(dest, ".env.example"),
    `NEXT_PUBLIC_SITE_URL=${canonicalUrl}\nENABLE_STYLEGUIDE=false\n`,
  );
  writeFileSync(
    path.join(dest, "preset.json"),
    `${JSON.stringify({ preset: options.preset, registryItems: registryItemsForPreset(options.preset) }, null, 2)}\n`,
  );

  const registryItems = registryItemsForPreset(options.preset);
  const pnpm = pnpmCommand();

  if (!options.skipInstall) {
    for (const item of registryItems) {
      const jsonPath = path.join(registryDir, `${item}.json`);
      if (!existsSync(jsonPath)) {
        throw new Error(`Registry item is missing. Build the registry first: ${jsonPath}`);
      }
      cpSync(jsonPath, path.join(dest, `${item}.json`));
    }

    run(pnpm.command, [...pnpm.prefix, "install"], { cwd: dest });

    for (const item of registryItems) {
      run(
        pnpm.command,
        [...pnpm.prefix, "dlx", "shadcn@latest", "add", `./${item}.json`, "--yes", "--overwrite"],
        { cwd: dest },
      );
    }

    if (!options.skipTypecheck) {
      run(pnpm.command, [...pnpm.prefix, "typecheck"], { cwd: dest });
    }
  }

  const nextCommands = [
    `cd ${dest}`,
    "pnpm install",
    "pnpm dev",
  ];

  return { dest, name, preset: options.preset, config, registryItems, nextCommands };
}
