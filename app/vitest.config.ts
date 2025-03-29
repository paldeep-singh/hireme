import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		exclude: ["node_modules"],
		workspace: [
			{
				extends: true,
				test: {
					name: "unit",
					include: ["**/*.test.ts", "**/*.test.tsx"],
					exclude: ["**/*.page.test.ts", "**/*.page.test.tsx"],
				},
			},
			{
				extends: true,
				test: {
					name: "page",
					include: ["**/*.page.test.ts", "**/*.page.test.tsx"],
				},
			},
		],
	},
});
