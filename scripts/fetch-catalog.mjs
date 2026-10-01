import { mkdir, writeFile } from "node:fs/promises";

const base = (process.env.NEXT_PUBLIC_DATA_BASE_URL || "").replace(/\/$/, "");
const source = process.env.SEEN_IT_CATALOG_URL || (base ? `${base}/catalog.json` : "");

if (!source) {
  console.log("No remote catalog configured; keeping any existing local catalog.");
  process.exit(0);
}

const response = await fetch(source);
if (!response.ok) {
  throw new Error(`Catalog download failed with HTTP ${response.status}`);
}

const bytes = new Uint8Array(await response.arrayBuffer());
await mkdir("public", { recursive: true });
await writeFile("public/catalog.json", bytes);
console.log(`Prepared local production catalog (${bytes.byteLength} bytes).`);
