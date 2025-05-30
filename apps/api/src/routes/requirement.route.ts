import { requirementInitializerSchema } from "@repo/api-types/validators/Requirement";
import { Router } from "express";
import { z } from "zod";
import {
	handleAddRequirement,
	handleAddRequirements,
} from "../controllers/requirement.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const requirementRouter = Router();

requirementRouter.post(
	"/requirement",
	authoriseRequest,
	validateRequestBody(requirementInitializerSchema),
	handleAddRequirement,
);

requirementRouter.post(
	"/requirements",
	authoriseRequest,
	validateRequestBody(z.array(requirementInitializerSchema)),
	handleAddRequirements,
);
