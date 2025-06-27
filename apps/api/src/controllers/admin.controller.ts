import { AdminCredentials } from "@repo/api-types/types/api/AdminCredentials";
import { StatusCodes } from "http-status-codes";
import { adminErrorMessages, adminService } from "../services/admin.service";
import { parseSessionCookie } from "../utils/parseSessionCookie";
import { RequestHandler } from "./sharedTypes";

export const handleLogin: RequestHandler<undefined, AdminCredentials> = async (
	req,
	res,
) => {
	const { email, password } = req.body;

	const { id, expiry } = await adminService.login(email, password);

	const isProd = process.env.NODE_ENV === "prod";

	res
		.status(StatusCodes.NO_CONTENT)
		.cookie("session", JSON.stringify({ id }), {
			domain: isProd ? "server.paldeepsingh.dev" : "localhost",
			path: "/api",
			expires: new Date(expiry),
			...(isProd && { sameSite: "none", secure: true }),
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
			error: adminErrorMessages.INVALID_SESSION,
		});

		return;
	}

	await adminService.clearSession(sessionId);

	res.status(StatusCodes.NO_CONTENT).clearCookie("session").send();
};
