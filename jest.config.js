export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    scriptPath: "dist/index.mjs",
    modules: true,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json",
      useESM: true,
    },
  },
};
