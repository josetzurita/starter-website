import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const file = path.join(process.cwd(), "public", "r", "registry.json");
  try {
    const body = await readFile(file, "utf8");
    return new Response(body, {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch {
    return Response.json({ error: "Registry catalog missing. Run registry:build." }, { status: 500 });
  }
}
