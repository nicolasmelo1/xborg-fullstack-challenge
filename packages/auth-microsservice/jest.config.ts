import { nestConfig } from "@xborg/config/tests/jest.nestjs";

export default {
  ...nestConfig,
  rootDir: ".",
  globalSetup: "<rootDir>/test/_setup/jest-global-setup.ts",
  globalTeardown: "<rootDir>/test/_setup/jest-global-teardown.ts",
  roots: ["<rootDir>/test/", "<rootDir>/src/"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.{ts,js}$": "$1",
  },
};
