import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { addHours, isBefore } from "date-fns";
import pgp from "pg-promise";
import Admin from "shared/generated/db/hire_me/Admin.js";
import Session, { SessionId } from "shared/generated/db/hire_me/Session.js";
import { isError } from "../utils/errors.js";
import db from "./db.js";

const { errors } = pgp;

// export type AdminDetails = Pick<Admin, "id" | "email" | "password_hash">;

// export type AdminSession = Pick<
//   Admin,
//   "id" | "session_token_hash" | "session_expiry"
// >;

export enum AdminErrorCodes {
	INVALID_USER = "INVALID_USER",
	MULTIPLE_USERS = "MULTIPLE_USERS",
	EXPIRED_SESSION = "EXPIRED_SESSION",
	INVALID_SESSION = "INVALID_SESSION",
}

async function login(email: string, password: string): Promise<SessionId> {
	try {
		const { password_hash, id: admin_id } = await db.one<
			Pick<Admin, "password_hash" | "id">
		>(" SELECT id, email, password_hash FROM admin WHERE email = $1 ", [email]);

		const passwordMatch = await bcrypt.compare(password, password_hash);

		if (!passwordMatch) {
			throw new Error(AdminErrorCodes.INVALID_USER);
		}

		const session_token = randomBytes(32).toString("hex");
		const session_expiry = addHours(new Date(), 2);

		const { id } = await db.one<{ id: SessionId }>(
			`INSERT INTO session (id, expiry, admin_id) 
     VALUES ($1, $2, $3)
     RETURNING id`,
			[session_token, session_expiry, admin_id],
		);

		return id;
	} catch (error) {
		if (!isError(error)) {
			throw error;
		}

		if (error instanceof errors.QueryResultError) {
			if (error.code === errors.queryResultErrorCode.noData) {
				throw new Error(AdminErrorCodes.INVALID_USER);
			}

			if (error.code === errors.queryResultErrorCode.multiple) {
				throw new Error(AdminErrorCodes.MULTIPLE_USERS);
			}
		}

		throw error;
	}
}

// async function getAdminDetails(email: string): Promise<AdminDetails> {
//   try {
//     const admin = await db.one<AdminDetails>(
//       " SELECT id, email, password_hash FROM admin WHERE email = $1 ",
//       [email],
//     );

//     return admin;
//   } catch (error) {
//     if (error instanceof errors.QueryResultError) {
//       if (error.code === errors.queryResultErrorCode.noData) {
//         throw new Error(AdminErrorCodes.INVALID_USER);
//       }

//       if (error.code === errors.queryResultErrorCode.multiple) {
//         throw new Error(AdminErrorCodes.MULTIPLE_USERS);
//       }
//     }

//     throw error;
//   }
// }

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
		const { expiry } = await db.one<Pick<Session, "expiry">>(
			"SELECT  expiry FROM session WHERE id = $1",
			[sessionId],
		);

		if (isBefore(new Date(), expiry)) {
			return { valid: true };
		}

		await db.none(`DELETE FROM session WHERE id = $1`, [sessionId]);

		return { valid: false, code: AdminErrorCodes.EXPIRED_SESSION };
	} catch (error) {
		if (error instanceof errors.QueryResultError) {
			if (error.code === errors.queryResultErrorCode.noData) {
				return { valid: false, code: AdminErrorCodes.INVALID_SESSION };
			}
		}

		throw error;
	}
}

async function clearSession(sessionId: SessionId): Promise<void> {
	try {
		await db.none(
			`DELETE FROM session
        WHERE id = $1`,
			[sessionId],
		);
	} catch (error) {
		throw error;
	}
}

// async function createNewSession({ id }: Pick<Admin, "id">): Promise<{
//   id: AdminId;
//   session_token: string;
// }> {
//   const session_token = randomBytes(32).toString("hex");
//   const session_token_hash = bcrypt.hash(session_token, 10);
//   const session_expiry = addHours(new Date(), 2);

//   try {
//     await db.none(
//       `UPDATE admin
//             SET session_token_hash = $1, session_expiry = $2
//             WHERE id = $3;`,
//       [session_token_hash, session_expiry, id],
//     );

//     return { id, session_token };
//   } catch (error) {
//     if (error instanceof errors.QueryResultError) {
//       if (error.code === errors.queryResultErrorCode.noData) {
//         throw new Error(AdminErrorCodes.INVALID_USER);
//       }
//     }

//     throw error;
//   }
// }

export const adminModel = {
	// getAdminDetails,
	// getAdminSession,
	clearSession,
	// createNewSession,
	login,
	validateSession,
};
