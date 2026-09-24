import { config } from "@cds/eslint-config/next";

export default [
  ...config,
  {
    ignores: [
      ".next/**",
      "e2e/**",
      "playwright-report/**",
      "test-results/**",
      "playwright.config.ts",
      "next-env.d.ts",
    ],
  },
];
