import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import extract from "../src/scrapers/extract";

// __dirname für ESM rekonstruieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FIXDIR = join(__dirname, "fixtures");
const files = readdirSync(FIXDIR).filter(f => /\.html?$/i.test(f));

const zeros: string[] = [];
const summary: { file: string; count: number }[] = [];

for (const f of files) {
  const html = readFileSync(join(FIXDIR, f), "utf8");
  const items = extract(html);
  summary.push({ file: f, count: items.length });
  if (items.length === 0) zeros.push(f);
}

// Ausgabe
console.log("=== Counts ===");
for (const s of summary.sort((a, b) => a.file.localeCompare(b.file))) {
  console.log(s.count.toString().padStart(3, " "), s.file);
}
console.log("\n=== Zero results (" + zeros.length + ") ===");
zeros.forEach(f => console.log(" -", f));

// Tiefenblick: 3 Beispiele der Null-Treffer
console.log("\n=== Samples from first 3 zero fixtures ===");
for (const f of zeros.slice(0, 3)) {
  const html = readFileSync(join(FIXDIR, f), "utf8");
  const items = extract(html);
  console.log("\n# " + f, "items:", items.length);
  console.log(items.slice(0, 10));
}
