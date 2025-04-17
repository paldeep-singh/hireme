import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminService } from "../services/admin.service";
import { AppError } from "../utils/errors";
import { parseSessionCookie } from "../utils/parseSessionCookie";

export enum authorisationrErrors {
	BAD_REQUEST = "Invalid session.",
	UNAUTHORISED_EXPIRED = "Session has expired, please login again.",
	UNAUTHORISED_INVALID = "Session invalid, please login again.",
	UNKNOWN = "An unknown error occurred",
}

export const authorisationErrorMessages = {
	BAD_REQUEST: "Invalid session cookie.",
} as const;

export async function authoriseRequest(
	req: Request,
	_: Response,
	next: NextFunction,
) {
	const sessionId = parseSessionCookie(req);

	if (!sessionId) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			true,
			authorisationErrorMessages.BAD_REQUEST,
		);
	}

	const result = await adminService.validateSession(sessionId);

	if (result.valid) {
		next();
		return;
	}

	throw new AppError(StatusCodes.UNAUTHORIZED, true, result.message);
}
