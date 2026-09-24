import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const parent = mkdtempSync(path.join(os.tmpdir(), "cds-create-site-"));
const tsxCli = path.join(root, "packages", "project", "node_modules", "tsx", "dist", "cli.mjs");
const runner = path.join(root, "packages", "project", "src", "create-site", "run.ts");

function runNode(args, cwd = root) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${args.join(" ")}`);
  }
}

function pnpmArgs(args) {
  const probe = spawnSync("pnpm", ["--version"], {
    encoding: "utf8",
    shell: process.platform === "win32",
    windowsHide: true,
  });
  if (probe.status === 0) {
    return ["pnpm", ...args];
  }
  return ["npx", "--yes", "pnpm@10.15.0", ...args];
}

function runPnpm(args, cwd) {
  const argv = pnpmArgs(args);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(`pnpm failed: ${args.join(" ")}`);
  }
}

try {
  for (const preset of ["minimal", "creative", "storytelling"]) {
    const dest = path.join(parent, `site ${preset}`);
    runNode([
      tsxCli,
      runner,
      `proof-${preset}`,
      "--preset",
      preset,
      "--dest",
      dest,
      "--skip-install",
    ]);
    const presetFile = JSON.parse(readFileSync(path.join(dest, "preset.json"), "utf8"));
    if (presetFile.preset !== preset) {
      throw new Error(`Preset mismatch at ${dest}`);
    }
    console.log(`Generated ${preset} at ${dest}`);
  }

  const occupied = path.join(parent, "already there");
  runNode([
    tsxCli,
    runner,
    "first-copy",
    "--preset",
    "minimal",
    "--dest",
    occupied,
    "--skip-install",
  ]);
  const overwrite = spawnSync(
    process.execPath,
    [tsxCli, runner, "second-copy", "--preset", "minimal", "--dest", occupied, "--skip-install"],
    { cwd: root, encoding: "utf8", shell: false },
  );
  if (overwrite.status === 0) {
    throw new Error("Generator overwrote a non-empty destination.");
  }

  for (const preset of ["minimal", "creative", "storytelling"]) {
    const dest = path.join(parent, `build-${preset}`);
    runNode([
      tsxCli,
      runner,
      `build-${preset}`,
      "--preset",
      preset,
      "--dest",
      dest,
      "--url",
      "http://127.0.0.1:3000",
    ]);
    if (!existsSync(path.join(dest, "package.json"))) {
      throw new Error(`Missing generated site at ${dest}`);
    }
    runPnpm(["build"], dest);
    console.log(`Validated ${preset} typecheck and build at ${dest}`);
  }
} finally {
  rmSync(parent, { recursive: true, force: true });
}
