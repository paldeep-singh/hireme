import { PreparedQuery } from "@pgtyped/runtime";
import db, { QueryResultErrors } from "../db";

vi.mock("pg", () => {
	return {
		Pool: vi.fn(() => ({})),
		types: {
			setTypeParser: vi.fn(),
		},
	};
});

// 🔧 Helper to create a mock PreparedQuery
function createMockQuery<Params, Result>(
	runImpl: (params: Params) => Promise<Result[]>,
): PreparedQuery<Params, Result> {
	return {
		run: vi.fn(runImpl),
	} as unknown as PreparedQuery<Params, Result>;
}

describe("db", () => {
	describe("one", () => {
		describe("Query returns one result", () => {
			it("returns the single row", async () => {
				const query = createMockQuery(() =>
					Promise.resolve([{ id: 1, name: "Alice" }]),
				);

				const result = await db.one(query, { id: 1 });

				expect(result).toEqual({ id: 1, name: "Alice" });
			});
		});

		describe("Query returns no results", () => {
			it("throws NO_DATA error", async () => {
				const query = createMockQuery(() => Promise.resolve([]));

				await expect(() => db.one(query, {})).rejects.toThrow(
					QueryResultErrors.NO_DATA,
				);
			});
		});

		describe("Query returns multiple results", () => {
			it("throws MULTIPLE error", async () => {
				const query = createMockQuery(() =>
					Promise.resolve([{ id: 1 }, { id: 2 }]),
				);

				await expect(() => db.one(query, {})).rejects.toThrow(
					QueryResultErrors.MULTIPLE,
				);
			});
		});
	});

	describe("many", () => {
		describe("Query returns multiple results", () => {
			it("returns all rows", async () => {
				const query = createMockQuery(() =>
					Promise.resolve([{ id: 1 }, { id: 2 }]),
				);

				const result = await db.many(query, {});
				expect(result).toEqual([{ id: 1 }, { id: 2 }]);
			});
		});

		describe("Query returns one result", () => {
			it("returns an array with one row", async () => {
				const query = createMockQuery(() => Promise.resolve([{ id: 1 }]));

				const result = await db.many(query, {});
				expect(result).toEqual([{ id: 1 }]);
			});
		});

		describe("Query returns no results", () => {
			it("throws NO_DATA error", async () => {
				const query = createMockQuery(() => Promise.resolve([]));

				await expect(() => db.many(query, {})).rejects.toThrow(
					QueryResultErrors.NO_DATA,
				);
			});
		});
	});

	describe("none", () => {
		describe("Query returns no results", () => {
			it("resolves without error", async () => {
				const query = createMockQuery(() => Promise.resolve([]));

				await expect(db.none(query, {})).resolves.toBeUndefined();
			});
		});

		describe("Query returns one result", () => {
			it("throws NOT_EMPTY error", async () => {
				const query = createMockQuery(() => Promise.resolve([{ id: 1 }]));

				await expect(() => db.none(query, {})).rejects.toThrow(
					QueryResultErrors.NOT_EMPTY,
				);
			});
		});

		describe("Query returns many result", () => {
			it("throws NOT_EMPTY error", async () => {
				const query = createMockQuery(() =>
					Promise.resolve([{ id: 1 }, { id: 2 }]),
				);

				await expect(() => db.none(query, {})).rejects.toThrow(
					QueryResultErrors.NOT_EMPTY,
				);
			});
		});
	});

	describe("oneOrNone", () => {
		describe("Query returns one result", () => {
			it("returns the result", async () => {
				const query = createMockQuery(() => Promise.resolve([{ id: 1 }]));

				const result = await db.oneOrNone(query, {});
				expect(result).toEqual({ id: 1 });
			});
		});

		describe("Query returns no results", () => {
			it("returns undefined", async () => {
				const query = createMockQuery(() => Promise.resolve([]));

				const result = await db.oneOrNone(query, {});
				expect(result).toBeUndefined();
			});
		});

		describe("Query returns multiple results", () => {
			it("throws MULTIPLE error", async () => {
				const query = createMockQuery(() =>
					Promise.resolve([{ id: 1 }, { id: 2 }]),
				);

				await expect(() => db.oneOrNone(query, {})).rejects.toThrow(
					QueryResultErrors.MULTIPLE,
				);
			});
		});
	});

	describe("manyOrNone", () => {
		describe("Query returns multiple results", () => {
			it("returns all rows", async () => {
				const query = createMockQuery(() =>
					Promise.resolve([{ id: 1 }, { id: 2 }]),
				);

				const result = await db.manyOrNone(query, {});
				expect(result).toEqual([{ id: 1 }, { id: 2 }]);
			});
		});

		describe("Query returns one result", () => {
			it("returns an array with one row", async () => {
				const query = createMockQuery(() => Promise.resolve([{ id: 1 }]));

				const result = await db.manyOrNone(query, {});
				expect(result).toEqual([{ id: 1 }]);
			});
		});

		describe("Query returns no results", () => {
			it("returns undefined", async () => {
				const query = createMockQuery(() => Promise.resolve([]));

				const result = await db.manyOrNone(query, {});
				expect(result).toBeUndefined();
			});
		});
	});

	describe("any", () => {
		describe("Query returns multiple results", () => {
			it("returns all rows", async () => {
				const query = createMockQuery(() =>
					Promise.resolve([{ id: 1 }, { id: 2 }]),
				);

				const result = await db.any(query, {});
				expect(result).toEqual([{ id: 1 }, { id: 2 }]);
			});
		});

		describe("Query returns one result", () => {
			it("returns an array with one row", async () => {
				const query = createMockQuery(() => Promise.resolve([{ id: 1 }]));

				const result = await db.any(query, {});
				expect(result).toEqual([{ id: 1 }]);
			});
		});

		describe("Query returns no results", () => {
			it("returns an empty array", async () => {
				const query = createMockQuery(() => Promise.resolve([]));

				const result = await db.any(query, {});
				expect(result).toEqual([]);
			});
		});
	});
});
