import { nextConfig } from "@xborg/config/eslint.nextjs";

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: [".next/**", "dist/**"],
  },
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "react/prop-types": "off",
    },
  },
];
