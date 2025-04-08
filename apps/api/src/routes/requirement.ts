import { requirementInitializer } from "@repo/shared/generated/api/hire_me/Requirement";
import { Router } from "express";
import { handleAddRequirement } from "../controllers/requirement";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const requirementRouter = Router();

requirementRouter.post(
	"/requirement",
	authoriseRequest,
	validateRequestBody(requirementInitializer),
	handleAddRequirement,
);
