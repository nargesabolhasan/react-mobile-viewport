import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

function prependUseClient() {
  for (const file of ["index.js", "index.cjs"]) {
    const filePath = join("dist", file);
    const content = readFileSync(filePath, "utf8");
    if (content.startsWith('"use client"') || content.startsWith("'use client'")) {
      continue;
    }
    writeFileSync(filePath, `"use client";\n${content}`);
  }
}

export default defineConfig({
  entry: {
    index: "src/index.ts",
    script: "src/script.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  target: "es2020",
  external: ["react", "react-dom", "react/jsx-runtime"],
  onSuccess: prependUseClient,
});
