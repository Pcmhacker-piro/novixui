import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(packageRoot, "../../src/styles.css");
const targetPath = resolve(packageRoot, "dist/styles.css");

const source = readFileSync(sourcePath, "utf8");
const packageCss = source.replace('@source "../src";', '@source ".";');

mkdirSync(dirname(targetPath), { recursive: true });
writeFileSync(targetPath, packageCss);