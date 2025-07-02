import { requirementInputSchema } from "@repo/api-types/validators/Requirement";
import { Router } from "express";
import { z } from "zod";
import { requirementUpdateInputSchema } from "../../../../packages/shared/validators/Requirement";
import {
	handleAddRequirement,
	handleAddRequirements,
	handleUpdateRequirement,
} from "../controllers/requirement.controller";
import { authoriseRequest } from "../middleware/authorisation";
import {
	validateRequestBody,
	validateRequestParams,
} from "../middleware/validation";
import { roleIdParamSchema } from "./shared/schemas";

export const requirementRouter = Router();

requirementRouter.post(
	"/role/:role_id/requirement",
	authoriseRequest,
	validateRequestParams(roleIdParamSchema),
	validateRequestBody(requirementInputSchema),
	handleAddRequirement,
);

requirementRouter.post(
	"/role/:role_id/requirements",
	authoriseRequest,
	validateRequestParams(roleIdParamSchema),
	validateRequestBody(z.array(requirementInputSchema)),
	handleAddRequirements,
);

requirementRouter.patch(
	"/requirement/:requirement_id",
	authoriseRequest,
	validateRequestParams(
		z.object({
			requirement_id: z.coerce.number().positive(),
		}),
	),
	validateRequestBody(requirementUpdateInputSchema),
	handleUpdateRequirement,
);
