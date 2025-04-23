import * as dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({ path: "./test.env" });

export default defineConfig({
	test: {
		globals: true,
		environment: "node", // Use jsdom for browser-like tests
		coverage: {
			reporter: ["html"], // Optional: Add coverage reports
			include: ["src/**/*.ts"],
			exclude: ["src/testUtils/**", "src/db/**", "src/index.ts"],
		},
		setupFiles: ["./vitest.setup.ts"],
		workspace: [
			{
				extends: true,
				test: {
					name: "unit",
					include: ["**/*.test.ts"],
					exclude: ["**/*.integration.test.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "integration",
					include: ["**/*.integration.test.ts"],
				},
			},
		],
	},
});
