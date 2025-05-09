import { Range } from "postgres-range";
import { NumRange } from "../types/api/Ranges.js";

export function toNumrangeObject(range: Range<number> | null): NumRange {
	if (!range) {
		return {
			max: null,
			min: null,
		};
	}

	return {
		max: range.upper ?? null,
		min: range.lower ?? null,
	};
}
