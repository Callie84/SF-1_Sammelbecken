import fs from "node:fs";
import { extract } from "../src/parsers/list";
const f = process.argv[2];
if (!f) { console.error("usage: try-extract <fixture.html>"); process.exit(1); }
const html = fs.readFileSync(`tests/fixtures/${f}`,"utf8");
const items = extract(html);
console.log(JSON.stringify({ file:f, count: items.length, sample: items.slice(0,5) }, null, 2));
