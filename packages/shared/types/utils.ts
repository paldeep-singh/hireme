export type NonNullableObject<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};
