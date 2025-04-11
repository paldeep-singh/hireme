import pluginJs from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import globals from "globals";
import tseslint from "typescript-eslint";
import disallowDbTypeImports from "./eslint-rules/disallow-db-type-imports.mjs";

export default tseslint.config(
	{
		extends: [
			pluginJs.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylisticTypeChecked,
		],
		files: ["**/*.ts"],
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				project: ["tsconfig.json"],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
		},
	},
	{
		files: ["src/models/queries/**/*.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
	{ rules: { "no-console": "error" }, ignores: ["scripts/**"] },
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{ languageOptions: { globals: globals.node } },
	{
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
			"vitest/expect-expect": [
				"error",
				{ assertFunctionNames: ["expect", "assert", "expectError"] },
			],
		},
		files: ["**/*.test.ts", "**/*.test.tsx"],
	},
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
		plugins: {
			custom: {
				rules: {
					"disallow-db-type-imports": disallowDbTypeImports,
				},
			},
		},
		rules: {
			"custom/disallow-db-type-imports": "error",
		},
	},
	{ ignores: ["coverage/**"] },
);
