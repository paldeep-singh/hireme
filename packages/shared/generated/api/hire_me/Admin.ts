// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";

/** Identifier type for hire_me.admin */
export type AdminId = number & { __brand: "AdminId" };

/** Represents the table hire_me.admin */
export default interface Admin {
	id: AdminId;

	email: string;

	password_hash: string;
}

/** Represents the initializer for the table hire_me.admin */
export interface AdminInitializer {
	email: string;

	password_hash: string;
}

/** Represents the mutator for the table hire_me.admin */
export interface AdminMutator {
	email?: string;

	password_hash?: string;
}

export const adminId = z.number() as unknown as z.Schema<AdminId>;

export const admin = z.object({
	id: adminId,
	email: z.string().email(),
	password_hash: z.string(),
}) as unknown as z.Schema<Admin>;

export const adminInitializer = z.object({
	id: adminId.optional(),
	email: z.string().email(),
	password_hash: z.string(),
}) as unknown as z.Schema<AdminInitializer>;

export const adminMutator = z.object({
	id: adminId.optional(),
	email: z.string().email().optional(),
	password_hash: z.string().optional(),
}) as unknown as z.Schema<AdminMutator>;
