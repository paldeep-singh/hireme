import { z } from "zod";
import { RoleId, RoleInitializer } from "../generated/api/hire_me/Role.js";
import { OmitStrict } from "../types/utils.js";
import { ZodShape } from "../utils/zod.js";
import { companyId } from "./Company.js";
import { contractType } from "./ContractType.js";

export type RoleInput = OmitStrict<RoleInitializer, "company_id">;

export const roleId = z.number().transform((val) => val as RoleId);

export const roleInputShape: ZodShape<RoleInput> = {
	title: z.string(),
	notes: z.string().nullable().optional(),
	ad_url: z.string().nullable().optional(),
	type: contractType,
	term: z.string().nullable().optional(),
	date_added: z.string().date().optional(),
};

export const roleInitializerShape: ZodShape<RoleInitializer> = {
	company_id: companyId,
	...roleInputShape,
};

const withRefinements = <
	T extends z.ZodObject<{ type: z.ZodTypeAny; term: z.ZodTypeAny }>,
>(
	schema: T,
) =>
	schema
		.refine((data) => !(data.type === "fixed_term" && data.term === null), {
			message: "Fixed-term roles must have a term.",
			path: ["term"],
		})
		.refine((data) => !(data.type === "permanent" && data.term !== null), {
			message: "Permanent roles must not have a term.",
			path: ["term"],
		});

export const roleInputSchema = withRefinements(z.object(roleInputShape));

export const roleInitializerSchema = withRefinements(
	z.object(roleInitializerShape),
);
