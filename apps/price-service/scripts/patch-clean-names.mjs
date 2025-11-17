import { readFileSync, writeFileSync } from "node:fs";

const file = ".\\src\\scrapers\\extract.ts";
let src = readFileSync(file,"utf8");

// 1) cleanName-Funktion vor function norm(...) einfügen (falls noch nicht da)
if(!src.includes("function cleanName(")){
  const idx = src.indexOf("function norm(");
  const inject = `
function cleanName(t?: string | null){
  const s = (t||"").trim();
  return s.startsWith("Read More about ") ? s.replace(/^Read More about\\s+/,"") : s;
}
`;
  if(idx>0){ src = src.slice(0,idx) + inject + src.slice(idx); }
}

// 2) Alle drei Push-Stellen auf cleanName(name) umstellen
src = src.replace(/\{\s*name\s*,\s*price\s*,/g, "{ name: cleanName(name), price,");

// 3) Falls irgendwo "const name = norm(...)" steht, auf let + cleanName umstellen
src = src.replace(/const\s+name\s*=\s*norm\(([^)]+)\);/g, "let name = cleanName(norm($1));");

// 4) Und falls "let name = norm(...)" steht, cleanName ergänzen
src = src.replace(/let\s+name\s*=\s*norm\(([^)]+)\);/g, "let name = cleanName(norm($1));");

writeFileSync(file, src, "utf8");
console.log("patched extract.ts");
