import pluginJs from "@eslint/js";
import * as importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";
import { resolve } from "node:path";

const project = resolve(process.cwd(), "tsconfig.json");

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
        project,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  { rules: { "no-console": "error" }, ignores: ["scripts/**"] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { import: importPlugin },
    rules: {
      "import/no-duplicates": "error",
    },
  },
  { ignores: ["dist"] }
);
