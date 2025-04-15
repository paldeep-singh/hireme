import { randomBytes } from "crypto";
import Session, {
	SessionId,
} from "@repo/api-types/generated/api/hire_me/Session";
import bcrypt from "bcryptjs";
import { addHours, isBefore } from "date-fns";
import { adminModel } from "../models/admin.model";
import { isError } from "../utils/errors";

export enum AdminErrorCodes {
	INVALID_USER = "INVALID_USER",
	MULTIPLE_USERS = "MULTIPLE_USERS",
	EXPIRED_SESSION = "EXPIRED_SESSION",
	INVALID_SESSION = "INVALID_SESSION",
}

async function login(
	email: string,
	password: string,
): Promise<Pick<Session, "id" | "expiry">> {
	try {
		const admin = await adminModel.getAdminByEmail(email);

		if (!admin) {
			throw new Error("no result");
		}

		const { id: admin_id, password_hash } = admin;

		const passwordMatch = await bcrypt.compare(password, password_hash);

		if (!passwordMatch) {
			throw new Error(AdminErrorCodes.INVALID_USER);
		}

		const session_token = randomBytes(32).toString("hex") as SessionId;
		const session_expiry = addHours(new Date(), 2);

		const session = await adminModel.addSession({
			id: session_token,
			expiry: session_expiry,
			admin_id,
		});

		if (!session) {
			throw new Error("no result");
		}

		return {
			id: session.id,
			expiry: session.expiry.toISOString(),
		};
	} catch (error) {
		if (!isError(error)) {
			throw error;
		}

		if (error.message == "no result") {
			throw new Error(AdminErrorCodes.INVALID_USER);
		}

		throw error;
	}
}

interface ValidSession {
	valid: true;
}

export interface InvalidSession {
	valid: false;
	code: AdminErrorCodes.EXPIRED_SESSION | AdminErrorCodes.INVALID_SESSION;
}

async function validateSession(
	sessionId: SessionId,
): Promise<ValidSession | InvalidSession> {
	try {
		const session = await adminModel.getSessionById(sessionId);

		if (!session) {
			throw new Error("no result");
		}

		if (isBefore(new Date(), session.expiry)) {
			return { valid: true };
		}

		await adminModel.deleteSessionById(sessionId);

		return { valid: false, code: AdminErrorCodes.EXPIRED_SESSION };
	} catch (error) {
		if (!isError(error)) {
			throw error;
		}

		if (error.message == "no result") {
			return { valid: false, code: AdminErrorCodes.INVALID_SESSION };
		}

		throw error;
	}
}

async function clearSession(sessionId: SessionId): Promise<void> {
	await adminModel.deleteSessionById(sessionId);
}

export const adminService = {
	clearSession,
	login,
	validateSession,
};
