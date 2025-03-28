import { NextFunction, Request, Response } from "express";

export function expectError(
	maybeError: unknown,
	expectedErrorMessage: string,
): void {
	if (maybeError instanceof Error) {
		return expect(maybeError.message).toContain(expectedErrorMessage);
	} else {
		throw new Error(`Expected error, got ${maybeError}`);
	}
}

export const getMockReq = (req: Partial<Request> = {}): Request => {
	return {
		body: {},
		params: {},
		query: {},
		headers: {},
		...req,
	} as Request;
};

export const getMockRes = (): { res: Response; next: NextFunction } => {
	const res: Partial<Response> = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
		send: vi.fn().mockReturnThis(),
		cookie: vi.fn().mockReturnThis(),
	};

	const next: NextFunction = vi.fn();

	return { res: res as Response, next };
};

// export async function clearAllTables() {
//   try {
//     // Step 1: Retrieve all table names from the 'public' schema
//     const tables = await db.any(`
//             SELECT tablename
//             FROM pg_tables
//             WHERE schemaname = 'hire_me'
//         `);

//     // Step 2: Generate the TRUNCATE command for each table
//     const truncateQueries = tables.map(
//       (table) => `TRUNCATE TABLE "${table.tablename}" CASCADE`,
//     );

//     // Step 3: Execute all TRUNCATE commands in a single transaction
//     await db.tx(async (t) => {
//       for (const query of truncateQueries) {
//         await t.none(query); // Execute each truncate command
//       }
//     });
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error("Error truncating tables:", error);
//   }
// }
