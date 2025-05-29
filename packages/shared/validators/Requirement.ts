import { z } from "zod";
import {
	RequirementId,
	RequirementInitializer,
} from "../generated/api/hire_me/Requirement.js";
import { ZodShape } from "../utils/zod.js";
import { roleId } from "./Role.js";

export const requirementId = z
	.number()
	.transform((val) => val as RequirementId);

export const requirementInitializerShape: ZodShape<RequirementInitializer> = {
	role_id: roleId,
	bonus: z.boolean(),
	description: z.string().min(1),
};

export const requirementInitializerSchema = z.object(
	requirementInitializerShape,
);
