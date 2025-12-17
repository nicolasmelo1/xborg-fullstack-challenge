import { nestConfig } from "@xborg/config/jest/jest.nestjs";

export default {
  ...nestConfig,
  rootDir: ".",
  globalSetup: "<rootDir>/tests/_setup/jest-global-setup.ts",
  globalTeardown: "<rootDir>/tests/_setup/jest-global-teardown.ts",
  roots: ["<rootDir>/tests/", "<rootDir>/src/"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.{ts,js}$": "$1",
  },
};
