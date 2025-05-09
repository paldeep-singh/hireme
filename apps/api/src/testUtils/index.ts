import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

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

export async function expectThrowsAppError(
	fn: () => Promise<unknown> | void | unknown,
	expectedStatusCode: number,
	expectedErrorMessage: string,
	expectedIsOperational: boolean,
) {
	try {
		await fn();
		expect(true).toBe(false); // should have thrown
	} catch (error) {
		expectAppError(
			error,
			expectedStatusCode,
			expectedErrorMessage,
			expectedIsOperational,
		);
	}
}

export function expectAppError(
	maybeAppError: unknown,
	expectedStatusCode: number,
	expectedErrorMessage: string,
	expectedIsOperational: boolean,
): void {
	if (maybeAppError instanceof AppError) {
		expect(maybeAppError.statusCode).toEqual(expectedStatusCode);
		expect(maybeAppError.message).toEqual(expectedErrorMessage);
		expect(maybeAppError.isOperational).toEqual(expectedIsOperational);
		return;
	} else {
		throw new Error(`Expected AppError, got ${maybeAppError}`);
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

export const getMockReqWithParams = <T>(params: T): Request<T> => {
	return {
		body: {},
		params,
		query: {},
		headers: {},
	} as Request<T>;
};

export const getMockRes = (): { res: Response; next: NextFunction } => {
	const res: Partial<Response> = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
		send: vi.fn().mockReturnThis(),
		cookie: vi.fn().mockReturnThis(),
		clearCookie: vi.fn().mockReturnThis(),
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
