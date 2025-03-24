import pluginJs from "@eslint/js";
import * as importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		plugins: { import: importPlugin },
		rules: {
			"import/no-duplicates": "error",
		},
		// other configs...
	},
	//   { rules: { "no-duplicate-imports": "error" } },
];
