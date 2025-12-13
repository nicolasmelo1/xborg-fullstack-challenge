import type { Config } from "jest";

export const nestConfig = {
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "@swc/jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage/unit",
  testEnvironment: "node",
  testTimeout: 30000,
} satisfies Config;
