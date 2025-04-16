import { StatusCodes } from "http-status-codes";

export function isError(maybeError: unknown): maybeError is Error {
	return maybeError instanceof Error;
}

export class AppError extends Error {
	constructor(
		public statusCode: StatusCodes,
		public isOperational: boolean,
		message: string,
	) {
		super(message);
		this.name = "AppError";
	}
}
