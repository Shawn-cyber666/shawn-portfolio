import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cases } from "../content/site-data.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const files = [
  "index.html",
  "resume/index.html",
  "assets/styles/site.css",
  "assets/scripts/site.js",
  ...cases.map((item) => `cases/${item.slug}/index.html`)
];

for (const file of files) await access(resolve(root, file));
for (const item of cases) {
  const html = await readFile(resolve(root, `cases/${item.slug}/index.html`), "utf8");
  if (!html.includes(item.title.split(" ")[0]) || !html.includes(item.disclosure)) throw new Error(`Missing content in ${item.slug}`);
}

const homepage = await readFile(resolve(root, "index.html"), "utf8");
for (const item of cases) if (!homepage.includes(item.title.split(" ")[0])) throw new Error(`Homepage missing ${item.title}`);
if (/GPA|GMV|销量|曝光量|转化率/.test(homepage)) throw new Error("Restricted metric language found on homepage");

console.log(`Checked ${files.length} generated files and ${cases.length} case disclosures.`);
