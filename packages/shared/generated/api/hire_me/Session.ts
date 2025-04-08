// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";
import { adminId, type AdminId } from "./Admin.js";

/** Identifier type for hire_me.session */
export type SessionId = string & { __brand: "SessionId" };

/** Represents the table hire_me.session */
export default interface Session {
	id: SessionId;

	expiry: string;

	admin_id: AdminId;
}

/** Represents the initializer for the table hire_me.session */
export interface SessionInitializer {
	id: SessionId;

	expiry: string;

	admin_id: AdminId;
}

/** Represents the mutator for the table hire_me.session */
export interface SessionMutator {
	id?: SessionId;

	expiry?: string;

	admin_id?: AdminId;
}

export const sessionId = z.string() as unknown as z.Schema<SessionId>;

export const session = z.object({
	id: sessionId,
	expiry: z.string().datetime(),
	admin_id: adminId,
}) as unknown as z.Schema<Session>;

export const sessionInitializer = z.object({
	id: sessionId,
	expiry: z.string().datetime(),
	admin_id: adminId,
}) as unknown as z.Schema<SessionInitializer>;

export const sessionMutator = z.object({
	id: sessionId.optional(),
	expiry: z.string().datetime().optional(),
	admin_id: adminId.optional(),
}) as unknown as z.Schema<SessionMutator>;
