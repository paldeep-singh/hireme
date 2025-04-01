import { requirementInitializer } from "@repo/shared/generated/db/hire_me/Requirement.js";
import { Router } from "express";
import { handleAddRequirement } from "../controllers/requirement.js";
import { authoriseRequest } from "../middleware/authorisation.js";
import { validateRequestBody } from "../middleware/validation.js";

export const requirementRouter = Router();

requirementRouter.post(
	"/requirement",
	authoriseRequest,
	validateRequestBody(requirementInitializer),
	handleAddRequirement,
);
