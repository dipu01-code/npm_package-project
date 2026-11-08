import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/web.ts", "src/react-native.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: false,
  shims: true,
  outDir: "dist",
});
