import { randomBytes } from "crypto";
import Session, { SessionId } from "@repo/shared/generated/api/hire_me/Session";
import bcrypt from "bcryptjs";
import { addHours, isBefore } from "date-fns";
import db, { QueryResultErrors } from "../db/db";
import { isError } from "../utils/errors";
import { addSession } from "./queries/admin/AddSession.queries";
import { deleteSessionById } from "./queries/admin/DeleteSessionById.queries";
import { getAdminByEmail } from "./queries/admin/GetAdminByEmail.queries";
import { getSessionExpiryById } from "./queries/admin/GetSessionExpiryById.queries";

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
		const result = await db.one(getAdminByEmail, { email });

		const { id: admin_id, password_hash } = result;

		const passwordMatch = await bcrypt.compare(password, password_hash);

		if (!passwordMatch) {
			throw new Error(AdminErrorCodes.INVALID_USER);
		}

		const session_token = randomBytes(32).toString("hex");
		const session_expiry = addHours(new Date(), 2);

		const session = await db.one(addSession, {
			admin_id,
			expiry: session_expiry,
			id: session_token,
		});

		return {
			id: session.id as SessionId,
			expiry: session.expiry.toISOString(),
		};
	} catch (error) {
		if (!isError(error)) {
			throw error;
		}

		if (error.message === QueryResultErrors.NO_DATA) {
			throw new Error(AdminErrorCodes.INVALID_USER);
		}

		if (error.message === QueryResultErrors.MULTIPLE) {
			throw new Error(AdminErrorCodes.MULTIPLE_USERS);
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
		const { expiry } = await db.one(getSessionExpiryById, { id: sessionId });

		if (isBefore(new Date(), expiry)) {
			return { valid: true };
		}

		await db.none(deleteSessionById, { id: sessionId });

		return { valid: false, code: AdminErrorCodes.EXPIRED_SESSION };
	} catch (error) {
		if (!isError(error)) {
			throw error;
		}

		if (error.message === QueryResultErrors.NO_DATA) {
			return { valid: false, code: AdminErrorCodes.INVALID_SESSION };
		}

		throw error;
	}
}

async function clearSession(sessionId: SessionId): Promise<void> {
	await db.none(deleteSessionById, { id: sessionId });
}

export const adminModel = {
	clearSession,
	login,
	validateSession,
};
