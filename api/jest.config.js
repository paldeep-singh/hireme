/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	setupFiles: ["./jest.setupFiles.ts"],
	setupFilesAfterEnv: ["jest-extended/all"],
};
