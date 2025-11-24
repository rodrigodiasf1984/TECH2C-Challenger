import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",

  // Você pode manter ou remover o globals antigo, mas a mágica acontece no transform abaixo
  globals: {
    // Isso ajuda em runtime, mas não resolve o SyntaxError
    "import.meta.env": {
      VITE_BASE_URL: "http://mock-api-url.com",
    },
  },

  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
            // ADICIONE ESTE BLOCO OPTIMIZER
            optimizer: {
              globals: {
                vars: {
                  // O SWC vai substituir literalmente o código 'import.meta.env.VITE_BASE_URL'
                  // pela string definida aqui. O uso de JSON.stringify garante as aspas corretas.
                  "import.meta.env.VITE_BASE_URL": JSON.stringify(
                    "http://mock-api-url.com"
                  ),
                },
              },
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
