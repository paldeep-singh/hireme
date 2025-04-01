import type { IPostgresInterval } from "postgres-interval";

export type IntervalObject = Pick<
	IPostgresInterval,
	"days" | "hours" | "milliseconds" | "minutes" | "months" | "seconds" | "years"
>;
