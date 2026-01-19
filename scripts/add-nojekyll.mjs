#!/usr/bin/env node

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../out");
const targetPath = path.join(outDir, ".nojekyll");

async function main() {
  try {
    await mkdir(outDir, { recursive: true });
    await writeFile(targetPath, "");
    console.log("✓ Added .nojekyll to out/");
  } catch (error) {
    console.error("Failed to add .nojekyll:", error.message);
    process.exit(1);
  }
}

main();
