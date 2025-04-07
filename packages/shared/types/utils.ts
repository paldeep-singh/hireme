export type NonNullableObject<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
