import { requirementInitializer } from "@repo/shared/generated/db/Requirement";
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
