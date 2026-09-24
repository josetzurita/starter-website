import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  const slug = name.replace(/\.json$/i, "").replace(/[^a-z0-9-]/gi, "");
  const file = path.join(process.cwd(), "public", "r", `${slug}.json`);
  try {
    const body = await readFile(file, "utf8");
    return new Response(body, {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch {
    return Response.json(
      { error: `Registry item "${slug}" was not found.` },
      { status: 404 },
    );
  }
}
