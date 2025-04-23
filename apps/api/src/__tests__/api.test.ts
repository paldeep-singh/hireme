// Preserve original environment variables
const ORIGINAL_ENV = { ...process.env };

describe("api.ts environment checks", () => {
	beforeEach(() => {
		// Reset process.env and remove CORS_ORIGIN to simulate missing var
		process.env = { ...ORIGINAL_ENV };
		delete process.env.CORS_ORIGIN;
	});

	afterEach(() => {
		// Restore original env
		process.env = { ...ORIGINAL_ENV };
		vi.restoreAllMocks();
	});

	it("throws an error if CORS_ORIGIN is not set", async () => {
		// Mock dotenv so import statement below does not load actual env file.
		vi.mock("dotenv", () => ({
			default: {
				config: () => ({
					parsed: {
						...ORIGINAL_ENV,
						CORS_ORIGIN: undefined,
					},
				}),
			},
		}));

		// Clear module cache to allow fresh import
		vi.resetModules();

		await expect(import("../api")).rejects.toThrow("CORS_ORIGIN is not set");
	});
});
