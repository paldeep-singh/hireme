import { Router } from "express";
import { requirementInitializer } from "shared/generated/db/hire_me/Requirement.js";
import { handleAddRequirement } from "../controllers/requirement.js";
import { validateRequestBody } from "../middleware/validation.js";

export const requirementRouter = Router();

requirementRouter.post(
  "/requirement",
  validateRequestBody(requirementInitializer),
  handleAddRequirement,
);
