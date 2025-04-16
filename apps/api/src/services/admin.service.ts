import { randomBytes } from "crypto";
import Session, {
	SessionId,
} from "@repo/api-types/generated/api/hire_me/Session";
import bcrypt from "bcryptjs";
import { addHours, isBefore } from "date-fns";
import { StatusCodes } from "http-status-codes";
import { adminModel } from "../models/admin.model";
import { AppError } from "../utils/errors";

export enum AdminErrorCodes {
	INVALID_USER = "INVALID_USER",
	MULTIPLE_USERS = "MULTIPLE_USERS",
	EXPIRED_SESSION = "EXPIRED_SESSION",
	INVALID_SESSION = "INVALID_SESSION",
}

export const adminErrorMessages = {
	INVALID_USER: "Invalid credentials provided.",
	EXPIRED_SESSION: "Session has expired.",
	INVALID_SESSION: "Invalid session.",
	SESSION_CREATION_FAILED: "Failed to create session.",
} as const;

async function login(
	email: string,
	password: string,
): Promise<Pick<Session, "id" | "expiry">> {
	const admin = await adminModel.getAdminByEmail(email);

	if (!admin) {
		throw new AppError(
			StatusCodes.UNAUTHORIZED,
			true,
			adminErrorMessages.INVALID_USER,
		);
	}

	const { id: admin_id, password_hash } = admin;

	const passwordMatch = await bcrypt.compare(password, password_hash);

	if (!passwordMatch) {
		throw new AppError(
			StatusCodes.UNAUTHORIZED,
			true,
			adminErrorMessages.INVALID_USER,
		);
	}

	const session_token = randomBytes(32).toString("hex") as SessionId;
	const session_expiry = addHours(new Date(), 2);

	const session = await adminModel.addSession({
		id: session_token,
		expiry: session_expiry,
		admin_id,
	});

	if (!session) {
		throw new AppError(
			StatusCodes.INTERNAL_SERVER_ERROR,
			true,
			adminErrorMessages.SESSION_CREATION_FAILED,
		);
	}

	return {
		id: session.id,
		expiry: session.expiry.toISOString(),
	};
}

interface ValidSession {
	valid: true;
}

export interface InvalidSession {
	valid: false;
	message:
		| typeof adminErrorMessages.EXPIRED_SESSION
		| typeof adminErrorMessages.INVALID_SESSION;
}

async function validateSession(
	sessionId: SessionId,
): Promise<ValidSession | InvalidSession> {
	const session = await adminModel.getSessionById(sessionId);

	if (!session) {
		return { valid: false, message: adminErrorMessages.INVALID_SESSION };
	}

	if (isBefore(new Date(), session.expiry)) {
		return { valid: true };
	}

	await adminModel.deleteSessionById(sessionId);

	return { valid: false, message: adminErrorMessages.EXPIRED_SESSION };
}

async function clearSession(sessionId: SessionId): Promise<void> {
	await adminModel.deleteSessionById(sessionId);
}

export const adminService = {
	clearSession,
	login,
	validateSession,
};
