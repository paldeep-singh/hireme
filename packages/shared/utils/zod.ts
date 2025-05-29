/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

// Taken from https://github.com/colinhacks/zod/issues/372#issuecomment-2466420879

type isAny<T> = [any extends T ? "true" : "false"] extends ["true"]
	? true
	: false;
type nonoptional<T> = T extends undefined ? never : T;
type nonnullable<T> = T extends null ? never : T;
type equals<X, Y> = [X] extends [Y] ? ([Y] extends [X] ? true : false) : false;
type IsBrandedNumber<T> = T extends number & { __brand: any } ? true : false;

type zodKey<T> =
	isAny<T> extends true
		? "any"
		: IsBrandedNumber<T> extends true
			? "brandedNumber"
			: equals<T, boolean> extends true //[T] extends [booleanUtil.Type]
				? "boolean"
				: [undefined] extends [T]
					? "optional"
					: [null] extends [T]
						? "nullable"
						: T extends any[]
							? "array"
							: equals<T, string> extends true
								? "string"
								: equals<T, bigint> extends true //[T] extends [bigintUtil.Type]
									? "bigint"
									: equals<T, number> extends true //[T] extends [numberUtil.Type]
										? "number"
										: equals<T, Date> extends true //[T] extends [dateUtil.Type]
											? "date"
											: T extends Record<string, any> //[T] extends [structUtil.Type]
												? "object"
												: "rest";

export type ToZod<T> = {
	any: never;
	optional: z.ZodOptional<ToZod<nonoptional<T>>>;
	nullable: z.ZodNullable<ToZod<nonnullable<T>>>;
	array: T extends (infer U)[] ? z.ZodArray<ToZod<U>> : never;
	string: z.ZodString;
	bigint: z.ZodBigInt;
	number: z.ZodType<T>;
	brandedNumber: z.ZodEffects<z.ZodNumber, T, number>;
	boolean: z.ZodBoolean;
	date: z.ZodDate;
	object: z.ZodObject<{ [k in keyof T]: ToZod<T[k]> }>;
	rest: z.ZodType<T>;
}[zodKey<T>];

export type ZodShape<T> = {
	// Require all the keys from T
	[key in keyof T]-?: ToZod<T[key]>;
};
