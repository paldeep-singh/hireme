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

const db = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export default db;
