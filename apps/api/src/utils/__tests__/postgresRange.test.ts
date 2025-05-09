import { faker } from "@faker-js/faker";
import { Range } from "postgres-range";
import { expectThrowsAppError } from "../../testUtils";
import { toPostgresNumRange } from "../postgresRange";

describe("toPostgresNumRange", () => {
	const column = faker.word.noun();

	describe("when both min and max are null", () => {
		it("returns null", () => {
			const result = toPostgresNumRange(
				{
					min: null,
					max: null,
				},
				column,
			);

			expect(result).toBeNull();
		});
	});

	describe("when both min and max are not null", () => {
		it("returns a postgres range", () => {
			const result = toPostgresNumRange(
				{
					min: 1,
					max: 5,
				},
				column,
			);

			expect(result).toBeInstanceOf(Range);
			expect(result?.lower).toEqual(1);
			expect(result?.upper).toEqual(5);
		});
	});

	describe("when only min is null", () => {
		it("throws an app error", () => {
			expectThrowsAppError(
				() =>
					toPostgresNumRange(
						{
							min: null,
							max: 5,
						},
						column,
					),
				400,
				`${column}: Max value is 5, min value cannot be null.`,
				true,
			);
		});
	});

	describe("when only max is null", () => {
		it("throws an app error", () => {
			expectThrowsAppError(
				() =>
					toPostgresNumRange(
						{
							min: 5,
							max: null,
						},
						column,
					),
				400,
				`${column}: Min value is 5, max value cannot be null.`,
				true,
			);
		});
	});

	describe("if min value is greater than max value", () => {
		it("throws an app error", () => {
			expectThrowsAppError(
				() =>
					toPostgresNumRange(
						{
							min: 5,
							max: 4,
						},
						column,
					),
				400,
				`${column}: Min value (5), cannot be greater than max (4)`,
				true,
			);
		});
	});
});
