// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";

/** Identifier type for hire_me.company */
export type CompanyId = number & { __brand: "CompanyId" };

/** Represents the table hire_me.company */
export default interface Company {
	id: CompanyId;

	name: string;

	notes: string | null;

	website: string | null;
}

/** Represents the initializer for the table hire_me.company */
export interface CompanyInitializer {
	name: string;

	notes?: string | null;

	website?: string | null;
}

/** Represents the mutator for the table hire_me.company */
export interface CompanyMutator {
	name?: string;

	notes?: string | null;

	website?: string | null;
}

export const companyId = z.number() as unknown as z.Schema<CompanyId>;

export const company = z.object({
	id: companyId,
	name: z.string(),
	notes: z.string().nullable(),
	website: z.string().url().nullable(),
}) as unknown as z.Schema<Company>;

export const companyInitializer = z.object({
	id: companyId.optional(),
	name: z.string(),
	notes: z.string().optional().nullable(),
	website: z.string().url().optional().nullable(),
}) as unknown as z.Schema<CompanyInitializer>;

export const companyMutator = z.object({
	id: companyId.optional(),
	name: z.string().optional(),
	notes: z.string().optional().nullable(),
	website: z.string().url().optional().nullable(),
}) as unknown as z.Schema<CompanyMutator>;
