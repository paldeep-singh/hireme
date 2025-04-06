import { Range } from "postgres-range";

export function formatNumberRange(range: Range<number>) {
	return {
		min: range.lower,
		max: range.upper,
	};
}
