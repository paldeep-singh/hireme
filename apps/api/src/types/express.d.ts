import "express-serve-static-core";

declare module "express-serve-static-core" {
	interface Request {
		// Use any here since express should not care what it is.
		// The specific route handlers with have specific types to use
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parsedParams: any; // or `any` if you prefer
	}
}
