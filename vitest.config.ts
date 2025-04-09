import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
    setupFiles: "./test-setup.ts",
    environment: "happy-dom",
    globals: true,

    coverage: {
      provider: "v8",
      exclude: [
        "coverage/**",
        "dist/**",
        "**/[.]**",
        "packages/*/test?(s)/**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        "**/\x00*",
        "cypress/**",
        "test?(s)/**",
        "test?(-*).?(c|m)[jt]s?(x)",
        "**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/vitest.{workspace,projects}.[jt]s?(on)",
        "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
        "eslint.config.{js,mjs,ts,mts}",
        "next.config.{js,mjs,ts,mts}",
        "postcss.config.{js,mjs,ts,mts}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
