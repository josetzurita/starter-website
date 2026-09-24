import { config as reactConfig } from "./react-internal.js";
import nextPlugin from "@next/eslint-plugin-next";

export const config = [
  ...reactConfig,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];
