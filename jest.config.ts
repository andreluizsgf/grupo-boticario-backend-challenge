import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
      "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
    },
    globalSetup: "./test/setup.ts",
    globalTeardown: "./test/teardown.ts",
    transformIgnorePatterns: ["../node_modules/(?!variables/.*)"],
    verbose: true,
    collectCoverage: true,
  };
};
