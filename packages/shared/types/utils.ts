export type NonNullableObject<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type OmitStrict<P, K extends keyof P> = Omit<P, Exclude<keyof P, K>>;
