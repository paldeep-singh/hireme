import { Range } from "postgres-range";

export function formatNumberRange(range: Range<number> | null) {
	if (!range) {
		return {
			max: null,
			min: null,
		};
	}

	return {
		min: range.lower,
		max: range.upper,
	};
}
