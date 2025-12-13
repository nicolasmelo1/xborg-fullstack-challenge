import { libraryConfig } from "@xborg/config/eslint.library";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["apps/**", "packages/**", "dist/**", "node_modules/**"],
  },
  ...libraryConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
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
