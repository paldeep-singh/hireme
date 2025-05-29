import { z } from "zod";
import { RoleId, RoleInitializer } from "../generated/api/hire_me/Role.js";
import { OmitStrict } from "../types/utils.js";
import { ZodShape } from "../utils/zod.js";
import { companyId } from "./Company.js";
import { contractType } from "./ContractType.js";

export type RoleInput = OmitStrict<RoleInitializer, "company_id">;

export const roleId = z.number().transform((val) => val as RoleId);

export const roleInputShape: ZodShape<RoleInput> = {
	title: z.string().min(1),
	notes: z.string().min(1).nullable().optional(),
	ad_url: z.string().url().nullable().optional(),
	type: contractType,
	term: z.string().duration().nullable().optional(),
	date_added: z.string().datetime().optional(),
};

export const roleInitializerShape: ZodShape<RoleInitializer> = {
	company_id: companyId,
	...roleInputShape,
};

export const roleInputSchema = z
	.object(roleInputShape)
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
