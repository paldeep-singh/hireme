import { z } from "zod";
import {
	RoleId,
	RoleInitializer,
	RoleMutator,
} from "../generated/api/hire_me/Role.js";
import { OmitStrict } from "../types/utils.js";
import { ZodShape } from "../utils/zod.js";
import { companyId } from "./Company.js";
import { contractType } from "./ContractType.js";

export type RoleInput = OmitStrict<RoleInitializer, "company_id">;

export type RoleUpdateInputShape = OmitStrict<
	RoleMutator,
	"company_id" | "date_added"
>;

export const roleId = z.number().transform((val) => val as RoleId);

export const roleInputShape: ZodShape<RoleInput> = {
	title: z.string().min(1),
	notes: z.string().min(1).nullable().optional(),
	ad_url: z.string().url().nullable().optional(),
	type: contractType,
	term: z.string().duration().nullable().optional(),
	date_added: z.string().datetime().optional(),
};

export const roleUpdateInputShape: ZodShape<RoleUpdateInputShape> = {
	title: z.string().min(1).optional(),
	notes: z.string().min(1).nullable().optional(),
	ad_url: z.string().url().nullable().optional(),
	type: contractType.optional(),
	term: z.string().duration().nullable().optional(),
};

export const roleInitializerShape: ZodShape<RoleInitializer> = {
	company_id: companyId,
	...roleInputShape,
};

export const roleInputSchema = z
	.object(roleInputShape)
	.strict()
	.refine((data) => !(data.type === "fixed_term" && data.term === null), {
		message: "Fixed-term roles must have a term.",
		path: ["term"],
	})
	.refine((data) => !(data.type === "permanent" && data.term !== null), {
		message: "Permanent roles must not have a term.",
		path: ["term"],
	});

export const roleUpdateInputSchema = z
	.object(roleUpdateInputShape)
	.strict()
	.refine((data) => !(data.type === "fixed_term" && data.term === null), {
		message: "Fixed-term roles must have a term.",
		path: ["term"],
	})
	.refine((data) => !(data.type === "permanent" && data.term !== null), {
		message: "Permanent roles must not have a term.",
		path: ["term"],
	});

export const roleInitializerSchema = z
	.object(roleInitializerShape)
	.refine((data) => !(data.type === "fixed_term" && data.term === null), {
		message: "Fixed-term roles must have a term.",
		path: ["term"],
	})
	.refine((data) => !(data.type === "permanent" && data.term !== null), {
		message: "Permanent roles must not have a term.",
		path: ["term"],
	});
