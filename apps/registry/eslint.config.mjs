import { config } from "@cds/eslint-config/next";

export default [
  ...config,
  {
    ignores: [".next/**", "public/r/**", "registry/default/**", "next-env.d.ts"],
  },
];
