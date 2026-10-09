// Read-only listing of content entries under src/content/, grouped by collection.
// Run: node scripts/list-content.mjs
//      node scripts/list-content.mjs --unpublished
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const contentDir = join(import.meta.dirname, "..", "src", "content");
const unpublishedOnly = process.argv.includes("--unpublished");

const collections = readdirSync(contentDir).filter((name) =>
  statSync(join(contentDir, name)).isDirectory()
);

for (const collection of collections) {
  const collectionDir = join(contentDir, collection);
  const slugs = readdirSync(collectionDir).filter((name) =>
    statSync(join(collectionDir, name)).isDirectory()
  );

  const entries = slugs.map((slug) => {
    const raw = readFileSync(join(collectionDir, slug, "index.mdx"), "utf-8");
    const frontmatter = raw.split("---")[1] ?? "";
    const title = frontmatter.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? "(no title)";
    const published = /^published:\s*true\s*$/m.test(frontmatter);
    return { slug, title, published };
  });

  const rows = unpublishedOnly ? entries.filter((e) => !e.published) : entries;
  if (unpublishedOnly && rows.length === 0) continue;
  console.log(`\n${collection} (${rows.length}${unpublishedOnly ? " unpublished" : ""}):`);
  for (const e of rows) console.log(`  [${e.published ? "x" : " "}] ${e.slug} — ${e.title}`);
}
