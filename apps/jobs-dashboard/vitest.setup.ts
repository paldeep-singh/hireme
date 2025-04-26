import "@testing-library/jest-dom/vitest";
import { beforeAll, vi } from "vitest";

beforeAll(() => {
	vi.spyOn(console, "error").mockImplementation((...args) => {
		if (
			typeof args[0] === "string" &&
			args[0].includes("Not implemented: navigation (except hash changes)")
		) {
			// Suppress just this specific jsdom error
			return;
		}
		// Let other errors through
		console.error(...args);
	});
});
