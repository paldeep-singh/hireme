import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";
import { AppError } from "../utils/errors";

export function validateRequestBody<Schema extends z.Schema>(
	schema: Schema,
): RequestHandler {
	// never is used in Request params as we do not need to know the types of the request parameters
	// or the response body at the moment.
	return (req: Request, _: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors
					.map((issue) => `${issue.path.join(".")} is ${issue.message}`)
					.join("/n");

				throw new AppError(StatusCodes.BAD_REQUEST, true, errorMessages);
			}

			throw error;
		}
	};
}
