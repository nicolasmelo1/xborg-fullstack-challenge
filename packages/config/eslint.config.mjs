import { config } from "./src/eslint/eslint.base.mjs";
import tsParser from "@typescript-eslint/parser";

export default [
  ...config,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts", "**/*.mjs"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // add override for any (a metric ton of them, initial conversion)
      "@typescript-eslint/no-explicit-any": "off",
      // we generally use this in isFunction, not via calling
      "@typescript-eslint/unbound-method": "off",
    },
  },
];
