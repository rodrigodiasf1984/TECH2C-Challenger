import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["<rootDir>/src/**/*.{spec,test}.{ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/.vite/"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg|ico)$": "<rootDir>/__mocks__/fileMock.js",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    "!src/types/index.ts",
    "!src/setupTests.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text", "text-summary"],
};

export default config;
