import { randomBytes } from "crypto";
import Session, {
	SessionId,
} from "@repo/api-types/generated/api/hire_me/Session";
import bcrypt from "bcryptjs";
import { addHours, isBefore } from "date-fns";
import { db } from "../db/database";
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
		const { id: admin_id, password_hash } = await db
			.withSchema("hire_me")
			.selectFrom("admin")
			.where("email", "=", email)
			.select(["id", "password_hash"])
			.executeTakeFirstOrThrow();

		const passwordMatch = await bcrypt.compare(password, password_hash);

		if (!passwordMatch) {
			throw new Error(AdminErrorCodes.INVALID_USER);
		}

		const session_token = randomBytes(32).toString("hex") as SessionId;
		const session_expiry = addHours(new Date(), 2);

		const session = await db
			.withSchema("hire_me")
			.insertInto("session")
			.values({
				admin_id,
				expiry: session_expiry,
				id: session_token,
			})
			.returning(["id", "expiry"])
			.executeTakeFirstOrThrow();

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
		const { expiry } = await db
			.withSchema("hire_me")
			.selectFrom("session")
			.where("id", "=", sessionId)
			.select("expiry")
			.executeTakeFirstOrThrow();

		if (isBefore(new Date(), expiry)) {
			return { valid: true };
		}

		await db
			.withSchema("hire_me")
			.deleteFrom("session")
			.where("id", "=", sessionId)
			.execute();

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
	await db
		.withSchema("hire_me")
		.deleteFrom("session")
		.where("id", "=", sessionId)
		.execute();
}

export const adminModel = {
	clearSession,
	login,
	validateSession,
};
