import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, resolve, relative } from "path";

const SRC_DIR = resolve(__dirname, "../src");

/**
 * Recursively collect all .ts/.tsx files in a directory.
 */
function collectTsFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectTsFiles(full));
    } else if (full.endsWith(".ts") || full.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Extract import paths from a TypeScript file.
 */
function extractImports(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  const importRegex = /(?:import|from)\s+["']([^"']+)["']/g;
  const imports: string[] = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

/**
 * Check if an import path targets a specific layer.
 */
function importsLayer(
  importPath: string,
  layer: string,
  filePath: string,
): boolean {
  // Handle alias imports (@/)
  if (importPath.startsWith("@/")) {
    return importPath.startsWith(`@/${layer}`);
  }
  // Handle relative imports
  if (importPath.startsWith(".")) {
    const resolved = resolve(join(filePath, ".."), importPath);
    const rel = relative(SRC_DIR, resolved);
    return rel.startsWith(layer);
  }
  return false;
}

describe("@lokini/web — Clean Architecture rules", () => {
  describe("Presentation layer", () => {
    const files = collectTsFiles(join(SRC_DIR, "presentation"));

    it("must NOT import from infrastructure/", () => {
      for (const file of files) {
        const imports = extractImports(file);
        for (const imp of imports) {
          expect(
            importsLayer(imp, "infrastructure", file),
            `presentation/${relative(SRC_DIR, file)} imports "${imp}" — presentation must NOT depend on infrastructure`,
          ).toBe(false);
        }
      }
    });
  });

  describe("Application layer", () => {
    const files = collectTsFiles(join(SRC_DIR, "application"));

    it("must NOT import from presentation/", () => {
      for (const file of files) {
        const imports = extractImports(file);
        for (const imp of imports) {
          expect(
            importsLayer(imp, "presentation", file),
            `application/${relative(SRC_DIR, file)} imports "${imp}" — application must NOT depend on presentation`,
          ).toBe(false);
        }
      }
    });

    it("must NOT import directly from infrastructure/", () => {
      for (const file of files) {
        const imports = extractImports(file);
        for (const imp of imports) {
          expect(
            importsLayer(imp, "infrastructure", file),
            `application/${relative(SRC_DIR, file)} imports "${imp}" — application must NOT depend directly on infrastructure`,
          ).toBe(false);
        }
      }
    });
  });

  describe("Infrastructure layer", () => {
    const files = collectTsFiles(join(SRC_DIR, "infrastructure"));

    it("must NOT import from presentation/", () => {
      for (const file of files) {
        const imports = extractImports(file);
        for (const imp of imports) {
          expect(
            importsLayer(imp, "presentation", file),
            `infrastructure/${relative(SRC_DIR, file)} imports "${imp}" — infrastructure must NOT depend on presentation`,
          ).toBe(false);
        }
      }
    });
  });

  describe("@lokini/core (domain) independence", () => {
    it("should be the only allowed domain dependency from all layers", () => {
      const allFiles = collectTsFiles(SRC_DIR);
      const domainDeps = ["@lokini/core"];
      for (const file of allFiles) {
        const imports = extractImports(file);
        for (const imp of imports) {
          // External domain-like packages that are NOT @lokini/core should not exist
          if (
            imp.startsWith("@lokini/") &&
            !domainDeps.includes(imp) &&
            imp !== "@lokini/core"
          ) {
            // Allow sub-path imports from @lokini/core
            if (!imp.startsWith("@lokini/core")) {
              expect.unreachable(
                `${file} imports "${imp}" — only @lokini/core is allowed as a domain package`,
              );
            }
          }
        }
      }
    });
  });
});
