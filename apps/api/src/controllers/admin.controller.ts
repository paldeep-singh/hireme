import { UserCredentials } from "@repo/api-types/types/api/UserCredentials";
import { StatusCodes } from "http-status-codes";
import { authorisationrErrors } from "../middleware/authorisation";
import { adminErrorMessages, adminService } from "../services/admin.service";
import { parseSessionCookie } from "../utils/parseSessionCookie";
import { RequestHandler } from "./sharedTypes";

export const handleLogin: RequestHandler<undefined, UserCredentials> = async (
	req,
	res,
) => {
	const { email, password } = req.body;

	const { id, expiry } = await adminService.login(email, password);

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
};

export const handleValidateSession: RequestHandler = async (req, res) => {
	const sessionId = parseSessionCookie(req);

	if (!sessionId) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: adminErrorMessages.INVALID_SESSION,
		});

		return;
	}

	const result = await adminService.validateSession(sessionId);

	if (result.valid) {
		res.status(StatusCodes.OK).send();
		return;
	}

	res.status(StatusCodes.UNAUTHORIZED).json({
		error: result.message,
	});
};

export const handleLogout: RequestHandler = async (req, res) => {
	const sessionId = parseSessionCookie(req);

	if (!sessionId) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: authorisationrErrors.BAD_REQUEST,
		});

		return;
	}

	await adminService.clearSession(sessionId);

	res.status(StatusCodes.NO_CONTENT).clearCookie("session").send();
};
