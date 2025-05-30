import { z } from "zod";
import {
	RequirementId,
	RequirementInitializer,
} from "../generated/api/hire_me/Requirement.js";
import { OmitStrict } from "../types/utils.js";
import { ZodShape } from "../utils/zod.js";
import { roleId } from "./Role.js";

export type RequirementInput = OmitStrict<RequirementInitializer, "role_id">;

export const requirementId = z
	.number()
	.transform((val) => val as RequirementId);

export const requirementInputShape: ZodShape<RequirementInput> = {
	bonus: z.boolean(),
	description: z.string().min(1),
};

export const requirementInitializerShape: ZodShape<RequirementInitializer> = {
	...requirementInputShape,
	role_id: roleId,
};

export const requirementInputSchema = z.object(requirementInitializerShape);

export const requirementInitializerSchema = z.object(
	requirementInitializerShape,
);
