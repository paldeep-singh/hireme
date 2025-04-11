/**
 * @fileoverview Disallow importing from @repo/shared/generated/db/* outside test files or src/testUtils
 */

import path from "path";
import { fileURLToPath } from "url";

// Handle __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	meta: {
		type: "problem",
		docs: {
			description:
				"disallow imports from @repo/shared/generated/db/* outside test files and test helpers.",
			category: "API Conventions",
			recommended: false,
		},
		messages: {
			forbiddenImport:
				"Import from '@repo/shared/generated/db/*' is only allowed in test files or test utils. Use '@repo/shared/generated/api/*' instead.",
		},
		schema: [],
	},

	create(context) {
		const filename = context.getFilename();
		const isTestFile = /\.test\.[jt]sx?$/.test(filename);
		const normalizedPath = path.normalize(filename);
		const isInTestUtils = normalizedPath.includes(
			`${path.sep}src${path.sep}testUtils${path.sep}`,
		);

		return {
			ImportDeclaration(node) {
				const importPath = node.source.value;
				if (
					importPath.startsWith("@repo/shared/generated/db/") &&
					!isTestFile &&
					!isInTestUtils
				) {
					context.report({
						node,
						messageId: "forbiddenImport",
					});
				}
			},
		};
	},
};
