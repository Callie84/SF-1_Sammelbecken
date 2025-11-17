import { readFileSync } from "node:fs";
import extract from "../src/scrapers/extract";
const f = process.argv[2];
const html = readFileSync(f,"utf8");
const items = extract(html);
console.log("count:", items.length);
console.log(items.slice(0,10));
