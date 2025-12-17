import globals from "globals";
import { config as baseConfig } from "./eslint.base.mjs";

/**
 * A custom ESLint configuration for Nest.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nestJsConfig = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
];

export default nestJsConfig;
