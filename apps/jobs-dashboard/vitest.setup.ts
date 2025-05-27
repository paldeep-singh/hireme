/* eslint-disable no-console */
import "@testing-library/jest-dom/vitest";
import { beforeAll, vi } from "vitest";

const originalConsoleError = console.error;

beforeAll(() => {
	vi.spyOn(console, "error").mockImplementation((...args) => {
		if (
			typeof args[0] === "string" &&
			args[0].includes("Not implemented: navigation (except hash changes)")
		) {
			// Suppress just this specific jsdom error
			return;
		}

		// ✅ Call the original implementation to avoid infinite loop
		originalConsoleError(...args);
	});
});
