// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";
import { companyId, type CompanyId } from "./Company.js";

/** Identifier type for hire_me.role */
export type RoleId = number & { __brand: "RoleId" };

/** Represents the table hire_me.role */
export default interface Role {
	id: RoleId;

	company_id: CompanyId;

	title: string;

	notes: string | null;

	ad_url: string | null;

	date_added: Date;
}

/** Represents the initializer for the table hire_me.role */
export interface RoleInitializer {
	company_id: CompanyId;

	title: string;

	notes?: string | null;

	ad_url?: string | null;

	/** Default value: now() */
	date_added?: Date;
}

/** Represents the mutator for the table hire_me.role */
export interface RoleMutator {
	company_id?: CompanyId;

	title?: string;

	notes?: string | null;

	ad_url?: string | null;

	date_added?: Date;
}

export const roleId = z.number() as unknown as z.Schema<RoleId>;

export const role = z.object({
	id: roleId,
	company_id: companyId,
	title: z.string(),
	notes: z.string().nullable(),
	ad_url: z.string().nullable(),
	date_added: z.date(),
}) as unknown as z.Schema<Role>;

export const roleInitializer = z.object({
	id: roleId.optional(),
	company_id: companyId,
	title: z.string(),
	notes: z.string().optional().nullable(),
	ad_url: z.string().optional().nullable(),
	date_added: z.date().optional(),
}) as unknown as z.Schema<RoleInitializer>;

export const roleMutator = z.object({
	id: roleId.optional(),
	company_id: companyId.optional(),
	title: z.string().optional(),
	notes: z.string().optional().nullable(),
	ad_url: z.string().optional().nullable(),
	date_added: z.date().optional(),
}) as unknown as z.Schema<RoleMutator>;
