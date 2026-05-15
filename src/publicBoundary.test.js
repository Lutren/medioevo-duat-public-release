import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const TEXT_EXTENSIONS = new Set([".css", ".html", ".json", ".jsonld", ".md", ".tsx", ".ts", ".txt", ".xml", ".yaml", ".yml"]);
const PUBLIC_SURFACES = ["src", "public", "docs", "README.md", "index.html", "public_release_package"];
const SKIP_FILES = new Set(["src/publicBoundary.test.js", "public_release_package/src/publicBoundary.test.js"]);

const localPathPatterns = [
  /C:\\Users\\/i,
  /C:\/Users\//i,
  /OneDrive[\\/]/i,
  /Escritorio[\\/]/i,
  /AppData[\\/]/i,
];

const strongClaimPatterns = [
  /achieved\s+AGI/i,
  /solved\s+consciousness/i,
  /validated\s+new\s+physics/i,
  /guaranteed\s+(safety|revenue|prediction)/i,
  /real\s+sensor\s+fusion/i,
];

function isTextFile(path) {
  return TEXT_EXTENSIONS.has(path.slice(path.lastIndexOf(".")).toLowerCase());
}

function collectFiles(entry) {
  const path = join(ROOT, entry);
  const stats = statSync(path);
  if (stats.isFile()) {
    return isTextFile(path) ? [path] : [];
  }
  return readdirSync(path).flatMap((name) => collectFiles(join(entry, name)));
}

function publicFiles() {
  return PUBLIC_SURFACES.flatMap(collectFiles).filter((path) => !SKIP_FILES.has(relative(ROOT, path).replaceAll("\\", "/")));
}

function lineIsBoundaryLanguage(line) {
  return /\b(no|not|do not|does not|without|avoid|excluded|blocked|prohibited|is not|must not)\b/i.test(line);
}

function isClaimsBoundaryDoc(path) {
  return relative(ROOT, path).replaceAll("\\", "/").endsWith("CLAIMS_BOUNDARY.md");
}

describe("public boundary", () => {
  it("does not ship local Windows paths in public text surfaces", () => {
    const offenders = publicFiles().filter((path) => {
      const text = readFileSync(path, "utf8");
      return localPathPatterns.some((pattern) => pattern.test(text));
    });

    expect(offenders.map((path) => relative(ROOT, path))).toEqual([]);
  });

  it("keeps public claims low and bounded", () => {
    const offenders = [];
    for (const path of publicFiles()) {
      if (isClaimsBoundaryDoc(path)) {
        continue;
      }
      const lines = readFileSync(path, "utf8").split(/\r?\n/);
      lines.forEach((line, index) => {
        if (!lineIsBoundaryLanguage(line) && strongClaimPatterns.some((pattern) => pattern.test(line))) {
          offenders.push(`${relative(ROOT, path)}:${index + 1}`);
        }
      });
    }

    expect(offenders).toEqual([]);
  });
});
