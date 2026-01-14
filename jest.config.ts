import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: ["**/*.test.ts"],

  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default config;
