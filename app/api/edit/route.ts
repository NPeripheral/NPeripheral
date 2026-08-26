import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * In-page copy editing, development only.
 *
 * Writes a text change straight back into the source file so an edit survives
 * a restart and lands in git as a normal diff -- not a CMS, not a database, and
 * nothing new to deploy.
 *
 * Three rules keep it from being a foot-gun:
 *   1. It 404s outside development. There is no production surface at all.
 *   2. Writes are confined to an allowlist of content directories, and the
 *      resolved path is re-checked after resolution so ../ cannot escape.
 *   3. The replacement is refused unless the original string appears EXACTLY
 *      once in the file. Zero matches means the page and the source disagree;
 *      several means the edit is ambiguous. Guessing either way corrupts copy.
 */
const ROOT = process.cwd();
const ALLOWED = ["lib/data", "components", "app"];

function isAllowed(abs: string) {
  const rel = path.relative(ROOT, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return false;
  if (!/\.(ts|tsx)$/.test(rel)) return false;
  return ALLOWED.some((dir) => rel === dir || rel.startsWith(dir + path.sep));
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  let body: { find?: string; replace?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const find = (body.find ?? "").trim();
  const replace = body.replace ?? "";
  if (!find) {
    return NextResponse.json({ error: "Nothing to find." }, { status: 400 });
  }
  if (find === replace.trim()) {
    return NextResponse.json({ ok: true, unchanged: true });
  }
  // A one- or two-character original matches far too much to be safe.
  if (find.length < 3) {
    return NextResponse.json(
      { error: "Original text is too short to locate safely." },
      { status: 400 },
    );
  }

  // Walk the allowlist directly rather than taking a glob dependency for one
  // dev-only route.
  const { readdir } = await import("node:fs/promises");
  const files: string[] = [];
  async function walk(dir: string) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name.startsWith(".")) continue;
        await walk(abs);
      } else if (/\.(ts|tsx)$/.test(e.name)) {
        files.push(abs);
      }
    }
  }
  for (const d of ALLOWED) await walk(path.join(ROOT, d));

  const hits: Array<{ file: string; count: number }> = [];
  for (const abs of files) {
    if (!isAllowed(abs)) continue;
    const source = await readFile(abs, "utf8");
    const count = source.split(find).length - 1;
    if (count > 0) hits.push({ file: abs, count });
  }

  const total = hits.reduce((n, h) => n + h.count, 0);
  if (total === 0) {
    return NextResponse.json(
      { error: "Could not find that text in the source. It may be generated." },
      { status: 404 },
    );
  }
  if (total > 1) {
    return NextResponse.json(
      {
        error: `That text appears ${total} times across ${hits.length} file(s). Edit it in the source so the change is unambiguous.`,
      },
      { status: 409 },
    );
  }

  const target = hits[0];
  if (!isAllowed(target.file)) {
    return NextResponse.json({ error: "Refused: outside the content allowlist." }, { status: 403 });
  }
  const source = await readFile(target.file, "utf8");
  await writeFile(target.file, source.replace(find, replace), "utf8");

  return NextResponse.json({ ok: true, file: path.relative(ROOT, target.file) });
}
