import { isoIntervalToPostgresInterval } from "../isoIntervalToPostgresInterval";

describe("isoIntervalToPostgresInterval", () => {
	describe("when valid ISO 8601 intervals are provided", () => {
		describe("years", () => {
			it("converts multiple years to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("P2Y")).toBe("2 years");
			});

			it("converts single year to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("P1Y")).toBe("1 year");
			});
		});

		describe("months", () => {
			it("converts multiple months to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("P3M")).toBe("3 mons");
			});

			it("converts single month to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("P1M")).toBe("1 mon");
			});
		});

		describe("days", () => {
			it("converts multiple days to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("P5D")).toBe("5 days");
			});

			it("converts single day to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("P1D")).toBe("1 day");
			});
		});

		describe("time components", () => {
			it("converts hours to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("PT2H")).toBe("02:00:00");
			});

			it("converts minutes to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("PT30M")).toBe("00:30:00");
			});

			it("converts seconds to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("PT45S")).toBe("00:00:45");
			});
		});

		describe("combined components", () => {
			it("converts date and time components to PostgreSQL interval", () => {
				expect(isoIntervalToPostgresInterval("P1Y2M3DT4H5M6S")).toBe(
					"1 year 2 mons 3 days 04:05:06",
				);
			});

			it("converts date and time components with fractional seconds", () => {
				expect(isoIntervalToPostgresInterval("P1Y2M3DT4H5M6.789S")).toBe(
					"1 year 2 mons 3 days 04:05:06.789",
				);
			});
		});

		describe("zero values", () => {
			it("handles zero years", () => {
				expect(isoIntervalToPostgresInterval("P0Y")).toBe("0 years");
			});

			it("handles zero hours", () => {
				expect(isoIntervalToPostgresInterval("PT0H")).toBe("00:00:00");
			});
		});
	});

	describe("when invalid ISO 8601 intervals are provided", () => {
		it("throws an error for empty string", () => {
			expect(() => isoIntervalToPostgresInterval("")).toThrow(
				"Invalid ISO 8601 interval format",
			);
		});

		it("throws an error for just 'P'", () => {
			expect(() => isoIntervalToPostgresInterval("P")).toThrow(
				"Invalid ISO 8601 interval format",
			);
		});

		it("throws an error for just 'PT'", () => {
			expect(() => isoIntervalToPostgresInterval("PT")).toThrow(
				"Invalid ISO 8601 interval format",
			);
		});

		it("throws an error for invalid format", () => {
			expect(() => isoIntervalToPostgresInterval("invalid")).toThrow(
				"Invalid ISO 8601 interval format",
			);
		});

		it("throws an error for negative years", () => {
			expect(() => isoIntervalToPostgresInterval("P-1Y")).toThrow(
				"Invalid ISO 8601 interval format",
			);
		});

		it("throws an error for invalid time components", () => {
			expect(() => isoIntervalToPostgresInterval("PT1H2M3S4")).toThrow(
				"Invalid ISO 8601 interval format",
			);
		});
	});
});
