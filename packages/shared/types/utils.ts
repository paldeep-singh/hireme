export type NonNullableObject<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type OmitStrict<T, P extends keyof T> = Omit<T, P>;
