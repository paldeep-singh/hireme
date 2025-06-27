import dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import parseInterval from "postgres-interval";
import { parse as parseRange, Range, serialize } from "postgres-range";
import Database from "./generated/Database";

dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL must be set");
}

console.log(
	"DATABASE_URL:",
	process.env.DATABASE_URL.replace(/:(.*)@/, ":****@"),
);

// Parse numrange types
const NUMRANGE_OID = 3906;
pg.types.setTypeParser(NUMRANGE_OID, (v) =>
	parseRange(v, (v) => parseInt(v, 10)),
);

// Serialize numrange types
Range.prototype.toPostgres = function (): string {
	return serialize(this as Range<number>);
};

// Parse interval types
const INTERVAL_OID = 1186;
pg.types.setTypeParser(INTERVAL_OID, (v) => parseInterval(v));

const dialect = new PostgresDialect({
	pool: new pg.Pool({
		connectionString: process.env.DATABASE_URL,
	}),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
	dialect,
});
