import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  dts: false,
  splitting: false,
  sourcemap: true,
  shims: true,
  // MIS plugin API is only used in Deno entry points, not in Node CLI
  external: ["../../mis-plugin-api.ts"],
});
