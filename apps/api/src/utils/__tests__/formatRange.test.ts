import { faker } from "@faker-js/faker";
import { Range } from "postgres-range";
import { formatNumberRange } from "../formatRange";

describe("formatNumberRange", () => {
	describe("when the range is not null", () => {
		it("returns the formatted range", () => {
			const min = faker.number.int({ min: 0, max: 2 });
			const max = faker.number.int({ min: 3, max: 5 });

			const range = new Range(min, max, 0);

			const expectedRange = { min, max };

			const formattedRange = formatNumberRange(range);

			expect(formattedRange).toEqual(expectedRange);
		});
	});

	describe("when the range is null", () => {
		it("returns the range with null for min anx max values", () => {
			const expectedRange = {
				min: null,
				max: null,
			};

			const formattedRange = formatNumberRange(null);

			expect(formattedRange).toEqual(expectedRange);
		});
	});
});
