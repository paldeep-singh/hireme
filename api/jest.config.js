/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  setupFiles: ["./setup-tests.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  globalTeardown: "./jest.teardown.ts",
};
