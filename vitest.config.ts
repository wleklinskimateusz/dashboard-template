import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
