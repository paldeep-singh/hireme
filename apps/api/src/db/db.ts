import { PreparedQuery } from "@pgtyped/runtime";
import dotenv from "dotenv";
import { Pool, types } from "pg";
import parseInterval from "postgres-interval";
import { parse, Range, serialize } from "postgres-range";

dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL must be set");
}

// Parse numrange types
const NUMRANGE_OID = 3906;
types.setTypeParser(NUMRANGE_OID, (v) => parse(v, (v) => parseInt(v, 10)));

// Serialize numrange types
Range.prototype.toPostgres = function (): string {
	return serialize(this as Range<number>);
};

// Parse interval types
const INTERVAL_OID = 1186;
types.setTypeParser(INTERVAL_OID, (v) => parseInterval(v));

export enum QueryResultErrors {
	NO_DATA = "NO_DATA",
	MULTIPLE = "MULTIPLE",
	NOT_EMPTY = "NOT_EMPTY",
}

class DB {
	private pool: Pool;

	constructor() {
		this.pool = new Pool({
			connectionString: process.env.DATABASE_URL,
		});
	}

	async one<Params, Result>(
		query: PreparedQuery<Params, Result>,
		params: Params,
	): Promise<Result> {
		const result = await query.run(params, this.pool);

		if (result.length === 0) {
			throw new Error(QueryResultErrors.NO_DATA);
		}

		if (result.length > 1) {
			throw new Error(QueryResultErrors.MULTIPLE);
		}

		return result[0];
	}

	async many<Params, Result>(
		query: PreparedQuery<Params, Result>,
		params: Params,
	): Promise<Result[]> {
		const result = await query.run(params, this.pool);
		if (result.length === 0) {
			throw new Error(QueryResultErrors.NO_DATA);
		}
		return result;
	}

	async none<Params, Result>(
		query: PreparedQuery<Params, Result>,
		params: Params,
	): Promise<void> {
		const result = await query.run(params, this.pool);
		if (result.length > 0) {
			throw new Error(QueryResultErrors.NOT_EMPTY);
		}
	}

	async oneOrNone<Params, Result>(
		query: PreparedQuery<Params, Result>,
		params: Params,
	): Promise<Result | void> {
		const result = await query.run(params, this.pool);

		if (result.length > 1) {
			throw new Error(QueryResultErrors.MULTIPLE);
		}

		if (result.length === 1) {
			return result[0];
		}
	}

	async manyOrNone<Params, Result>(
		query: PreparedQuery<Params, Result>,
		params: Params,
	): Promise<Result[] | void> {
		const result = await query.run(params, this.pool);

		if (result.length > 0) {
			return result;
		}
	}

	async any<Params, Result>(
		query: PreparedQuery<Params, Result>,
		params: Params,
	): Promise<Result[]> {
		return await query.run(params, this.pool);
	}
}

const db = new DB();

export default db;
