import { SessionId } from "@repo/shared/generated/db/hire_me/Session.js";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AdminErrorCodes, adminModel } from "../models/admin.js";
import { isError } from "../utils/errors.js";

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
	if (!req.cookies) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: authorisationrErrors.BAD_REQUEST,
		});
		return;
	}

	let session;
	try {
		session = JSON.parse(req.cookies.session);
	} catch {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: authorisationrErrors.BAD_REQUEST,
		});
		return;
	}

	if (!(typeof session === "object") || !("id" in session)) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: authorisationrErrors.BAD_REQUEST,
		});
		return;
	}

	try {
		const result = await adminModel.validateSession(session.id as SessionId);

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
