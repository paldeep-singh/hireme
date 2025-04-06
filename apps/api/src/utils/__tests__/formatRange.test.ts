import { faker } from "@faker-js/faker";
import { Range } from "postgres-range";
import { formatNumberRange } from "../formatRange";

describe("formatNumberRange", () => {
	it("returns the formatted range", () => {
		const min = faker.number.int({ min: 0, max: 2 });
		const max = faker.number.int({ min: 3, max: 5 });

		const range = new Range(min, max, 0);

		const expectedRange = { min, max };

		const formattedRange = formatNumberRange(range);

		expect(formattedRange).toEqual(expectedRange);
	});
});
