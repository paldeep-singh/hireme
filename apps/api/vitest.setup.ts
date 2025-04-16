import * as matchers from "jest-extended";
import { expect } from "vitest";

expect.extend(matchers);

// eslint-disable-next-line no-console
const originalConsoleError = console.error;

vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
	// Suppress error logs from global error handler.
	if (typeof args[0] === "string" && args[0].startsWith("Unexpected error:")) {
		return;
	}

	// Pass everything else through
	return originalConsoleError(...args);
});
