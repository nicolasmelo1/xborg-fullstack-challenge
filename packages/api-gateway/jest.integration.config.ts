import { nestConfig } from "@xborg/config/jest/jest.nestjs";

export default {
  ...nestConfig,
  rootDir: ".",
  globalSetup: "<rootDir>/tests/setup/jest-global-setup.ts",
  globalTeardown: "<rootDir>/tests/setup/jest-global-teardown.ts",
  roots: ["<rootDir>/tests/", "<rootDir>/src/"],
  testRegex: ".*\\.integration\\.test\\.ts$",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.{ts,js}$": "$1",
  },
  silent: false,
};
