import dotenv from "dotenv";
import pgPromise from "pg-promise";
import type { TypeId } from "pg-promise/typescript/pg-subset.d.ts";
import parseInterval from "postgres-interval";
import { parse, Range, serialize } from "postgres-range";

dotenv.config();

const pgp = pgPromise({
	schema: "hire_me",
});

// Parse numrange types
const NUMRANGE_OID = 3906 as TypeId;
pgp.pg.types.setTypeParser(NUMRANGE_OID, (v) =>
	parse(v, (v) => parseInt(v, 10)),
);

// Serialize numrange types
Range.prototype.toPostgres = function (): string {
	return serialize(this as Range<number>);
};

// Parse interval types
const INTERVAL_OID = 1186;
pgp.pg.types.setTypeParser(INTERVAL_OID, (v) => parseInterval(v));

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL must be set");
}

const db = pgp(process.env.DATABASE_URL);

export default db;
