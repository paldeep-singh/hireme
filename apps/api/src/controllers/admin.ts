import { UserCredentials } from "@repo/shared/types/api/UserCredentials";
import { StatusCodes } from "http-status-codes";
import { authorisationrErrors } from "../middleware/authorisation";
import { AdminErrorCodes, adminModel } from "../models/admin";
import { isError } from "../utils/errors";
import { parseSessionCookie } from "../utils/parseSessionCookie";
import { controllerErrorMessages } from "./errors";
import { RequestHandler } from "./sharedTypes";

export const handleLogin: RequestHandler<undefined, UserCredentials> = async (
	req,
	res,
) => {
	try {
		const { email, password } = req.body;

		const { id, expiry } = await adminModel.login(email, password);

		// TODO: add secure flag to cookie
		// alter domain names for production
		res
			.status(StatusCodes.NO_CONTENT)
			.cookie("session", JSON.stringify({ id }), {
				domain: "localhost",
				path: "/api",
				expires: new Date(expiry),
			})
			.send();
		return;
	} catch (error) {
		if (!isError(error)) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: controllerErrorMessages.DATABASE_ERROR,
			});
			return;
		}

		if (error.message === AdminErrorCodes.INVALID_USER) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				error: controllerErrorMessages.INVALID_CREDENTIALS,
			});
			return;
		}

		if (error.message === AdminErrorCodes.MULTIPLE_USERS) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: controllerErrorMessages.DATABASE_ERROR,
			});
			return;
		}
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: `${controllerErrorMessages.UNKNOWN_ERROR}: ${error.message}`,
		});
	}
};

export const handleValidateSession: RequestHandler = async (req, res) => {
	const sessionId = parseSessionCookie(req);

	if (!sessionId) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: authorisationrErrors.BAD_REQUEST,
		});

		return;
	}

	try {
		const result = await adminModel.validateSession(sessionId);

		if (result.valid) {
			res.status(StatusCodes.OK).send();
			return;
		}

		await adminModel.clearSession(sessionId);

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
};

export const handleLogout: RequestHandler = async (req, res) => {
	const sessionId = parseSessionCookie(req);

	if (!sessionId) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: authorisationrErrors.BAD_REQUEST,
		});

		return;
	}

	try {
		await adminModel.clearSession(sessionId);

		res.status(StatusCodes.NO_CONTENT).clearCookie("session").send();
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
};
