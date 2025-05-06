import { NumRange } from "@repo/api-types/types/api/Ranges";
import { StatusCodes } from "http-status-codes";
import { isNull, isUndefined } from "lodash-es";
import { Range } from "postgres-range";
import { AppError } from "./errors";

export function toPostgresNumRange(
	range: NumRange | null | undefined,
	columnName: string,
): Range<number> | null {
	if (isNull(range) || isUndefined(range)) {
		return null;
	}

	const maxIsNull = isNull(range.max);
	const minIsNull = isNull(range.min);

	if (maxIsNull && minIsNull) {
		return null;
	}

	if (minIsNull) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			true,
			`${columnName}: Max value is ${range.max}, min value cannot be null.`,
		);
	}

	if (maxIsNull) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			true,
			`${columnName}: Min value is ${range.min}, max value cannot be null.`,
		);
	}

	// Ok to assert both are not null here since we have checked above.
	const { min, max } = range as { min: number; max: number };

	if (min > max) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			true,
			`${columnName}: Min value (${min}), cannot be greater than max (${max})`,
		);
	}

	return new Range(min, max, 0);
}
