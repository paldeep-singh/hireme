import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AdminErrorCodes, adminService } from "../services/admin.service";
import { isError } from "../utils/errors";
import { parseSessionCookie } from "../utils/parseSessionCookie";

export enum authorisationrErrors {
	BAD_REQUEST = "Invalid session.",
	UNAUTHORISED_EXPIRED = "Session has expired, please login again.",
	UNAUTHORISED_INVALID = "Session invalid, please login again.",
	UNKNOWN = "An unknown error occurred",
}

export async function authoriseRequest(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const sessionId = parseSessionCookie(req);

	if (!sessionId) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: authorisationrErrors.BAD_REQUEST,
		});

		return;
	}

	try {
		const result = await adminService.validateSession(sessionId);

		if (result.valid) {
			next();
			return;
		}

		if (result.code === AdminErrorCodes.EXPIRED_SESSION) {
			res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ error: authorisationrErrors.UNAUTHORISED_EXPIRED });
			return;
		}

		if (result.code === AdminErrorCodes.INVALID_SESSION) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				error: authorisationrErrors.UNAUTHORISED_INVALID,
			});
			return;
		}

		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: authorisationrErrors.UNKNOWN });
		return;
	} catch (error) {
		if (!isError(error)) {
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ error: authorisationrErrors.UNKNOWN });
			return;
		}
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: error.message });
	}
}
