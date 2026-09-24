import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const registry = JSON.parse(
    await readFile(path.join(root, "registry.json"), "utf8"),
  );
  const outDir = path.join(root, "public", "r");
  await mkdir(outDir, { recursive: true });

  const catalogItems = [];

  for (const item of registry.items) {
    const files = [];
    for (const file of item.files) {
      const abs = path.join(root, file.path);
      const content = await readFile(abs, "utf8");
      files.push({ ...file, content });
    }
    const built = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      files,
    };
    await writeFile(
      path.join(outDir, `${item.name}.json`),
      `${JSON.stringify(built, null, 2)}\n`,
    );
    catalogItems.push(item);
  }

  await writeFile(
    path.join(outDir, "registry.json"),
    `${JSON.stringify({ ...registry, items: catalogItems }, null, 2)}\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
