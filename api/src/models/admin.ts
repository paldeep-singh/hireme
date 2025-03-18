import db from "./db.js";
import Admin, { AdminId } from "shared/generated/db/hire_me/Admin.js";
import { errors } from "pg-promise";

export type AdminDetails = Pick<Admin, "id" | "email" | "password_hash">;

export type AdminSession = Pick<
  Admin,
  "id" | "session_token_hash" | "session_expiry"
>;

export enum AdminErrorCodes {
  INVALID_USER = "INVALID_USER",
  MULTIPLE_USERS = "MULTIPLE_USERS",
}

async function getAdminDetails(email: string): Promise<AdminDetails> {
  try {
    const admin = await db.one<AdminDetails>(
      " SELECT id, email, password_hash FROM admin WHERE email = $1 ",
      [email],
    );

    return admin;
  } catch (error) {
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

async function getAdminSession(adminId: AdminId): Promise<AdminSession> {
  try {
    const adminSession = await db.one<AdminSession>(
      "SELECT id, session_token_hash, session_expiry FROM admin WHERE id = $1",
      [adminId],
    );

    return adminSession;
  } catch (error) {
    if (error instanceof errors.QueryResultError) {
      if (error.code === errors.queryResultErrorCode.noData) {
        throw new Error(AdminErrorCodes.INVALID_USER);
      }
    }

    throw error;
  }
}

async function clearAdminSession(adminId: AdminId): Promise<void> {
  try {
    await db.one(
      `UPDATE admin
        SET session_token_hash = NULL, session_expiry = NULL
        WHERE id = $1
        RETURNING id`,
      [adminId],
    );
  } catch (error) {
    if (error instanceof errors.QueryResultError) {
      if (error.code === errors.queryResultErrorCode.noData) {
        throw new Error(AdminErrorCodes.INVALID_USER);
      }
    }

    throw error;
  }
}

async function updateAdminSession({
  id,
  session_expiry,
  session_token_hash,
}: NonNullable<AdminSession>): Promise<AdminSession> {
  try {
    const session = await db.one(
      `UPDATE admin
            SET session_token_hash = $1, session_expiry = $2
            WHERE id = $3
            RETURNING id, session_token_hash, session_expiry`,
      [session_token_hash, session_expiry, id],
    );

    return session;
  } catch (error) {
    if (error instanceof errors.QueryResultError) {
      if (error.code === errors.queryResultErrorCode.noData) {
        throw new Error(AdminErrorCodes.INVALID_USER);
      }
    }

    throw error;
  }
}

export const adminModel = {
  getAdminDetails,
  getAdminSession,
  clearAdminSession,
  updateAdminSession,
};
