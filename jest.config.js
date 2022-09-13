export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    scriptPath: "dist/index.mjs",
    modules: true,
  },
};
