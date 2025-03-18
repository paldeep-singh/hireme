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

export const adminModel = {
  getAdminDetails,
  getAdminSession,
};
