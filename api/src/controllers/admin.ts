import { StatusCodes } from "http-status-codes";
import { SessionId } from "shared/generated/db/hire_me/Session.js";
import { UserCredentials } from "shared/types/userCredentials.js";
import { authorisationrErrors } from "../middleware/authorisation.js";
import { AdminErrorCodes, adminModel } from "../models/admin.js";
import { isError } from "../utils/errors.js";
import { controllerErrorMessages } from "./errors.js";
import { RequestHandler } from "./sharedTypes.js";

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
				expires: expiry,
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
	if (!req.cookies) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: authorisationrErrors.BAD_REQUEST });
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
			res.status(StatusCodes.OK).send();
			return;
		}

		await adminModel.clearSession(session.id as SessionId);

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
