import { requirementInitializerSchema } from "@repo/api-types/validators/Requirement";
import { Router } from "express";
import { handleAddRequirement } from "../controllers/requirement.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const requirementRouter = Router();

requirementRouter.post(
	"/requirement",
	authoriseRequest,
	validateRequestBody(requirementInitializerSchema),
	handleAddRequirement,
);
