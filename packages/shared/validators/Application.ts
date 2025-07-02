import { z } from "zod";
import {
	ApplicationId,
	ApplicationInitializer,
	ApplicationMutator,
} from "../generated/api/hire_me/Application.js";
import { OmitStrict } from "../types/utils.js";
import { ZodShape } from "../utils/zod.js";
import { roleId } from "./Role.js";

export const applicationId = z
	.number()
	.transform((val) => val as ApplicationId);

export type ApplicationInput = OmitStrict<
	ApplicationInitializer,
	"role_id" | "date_submitted"
>;

export type ApplicationUpdateInput = Pick<
	ApplicationMutator,
	"cover_letter" | "date_submitted"
>;

export const applicationInputShape: ZodShape<ApplicationInput> = {
	cover_letter: z.string().min(1).nullable().optional(),
};

export const applicationInitializerShape: ZodShape<ApplicationInitializer> = {
	...applicationInputShape,
	role_id: roleId,
	date_submitted: z.string().datetime().nullable().optional(),
};

export const applicationUpdateInputShape: ZodShape<ApplicationUpdateInput> = {
	cover_letter: z.string().min(1).nullable().optional(),
	date_submitted: z.string().datetime().nullable().optional(),
};

export const applicationInputSchema = z.object(applicationInputShape).strict();

export const applicationInitializerSchema = z
	.object(applicationInitializerShape)
	.strict();

export const applicationUpdateInputSchema = z
	.object(applicationUpdateInputShape)
	.strict();
