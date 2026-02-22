import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

const SRC_DIR = resolve(__dirname, "../src");

/**
 * Recursively collect all .ts files in a directory.
 */
function collectTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectTsFiles(full));
    } else if (full.endsWith(".ts")) {
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

describe("@lokini/core — Architecture rules", () => {
  const allFiles = collectTsFiles(SRC_DIR);

  it("should not depend on React or any UI framework", () => {
    const forbidden = ["react", "react-dom", "react-native"];
    for (const file of allFiles) {
      const imports = extractImports(file);
      for (const imp of imports) {
        for (const lib of forbidden) {
          expect(
            imp.startsWith(lib),
            `${file} imports "${imp}" — @lokini/core must not depend on UI frameworks`,
          ).toBe(false);
        }
      }
    }
  });

  it("should not depend on browser APIs (DOM, window, document)", () => {
    const forbidden = ["jsdom", "happy-dom"];
    for (const file of allFiles) {
      const imports = extractImports(file);
      for (const imp of imports) {
        for (const lib of forbidden) {
          expect(
            imp.startsWith(lib),
            `${file} imports "${imp}" — @lokini/core must not depend on browser APIs`,
          ).toBe(false);
        }
      }
    }
  });

  it("should not depend on any HTTP/WebSocket client library", () => {
    const forbidden = ["axios", "node-fetch", "ws", "socket.io"];
    for (const file of allFiles) {
      const imports = extractImports(file);
      for (const imp of imports) {
        for (const lib of forbidden) {
          expect(
            imp.startsWith(lib),
            `${file} imports "${imp}" — @lokini/core must not depend on network libraries`,
          ).toBe(false);
        }
      }
    }
  });

  it("should not depend on storage implementations (IndexedDB, SQLite)", () => {
    const forbidden = ["idb", "better-sqlite3", "sql.js", "localforage"];
    for (const file of allFiles) {
      const imports = extractImports(file);
      for (const imp of imports) {
        for (const lib of forbidden) {
          expect(
            imp.startsWith(lib),
            `${file} imports "${imp}" — @lokini/core must not depend on storage implementations`,
          ).toBe(false);
        }
      }
    }
  });

  it("should only have allowed external dependencies", () => {
    const allowed = [
      "@automerge/",
      "libsodium-wrappers",
      // Relative imports are always allowed
    ];
    for (const file of allFiles) {
      const imports = extractImports(file);
      for (const imp of imports) {
        if (imp.startsWith(".") || imp.startsWith("/")) continue; // relative
        const isAllowed = allowed.some((prefix) => imp.startsWith(prefix));
        expect(
          isAllowed,
          `${file} imports "${imp}" — not in the allowed external dependency list for @lokini/core`,
        ).toBe(true);
      }
    }
  });
});
