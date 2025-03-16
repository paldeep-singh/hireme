import { Router } from "express";
import { requirementInitializer } from "shared/src/generated/db/hire_me/Requirement";
import { handleAddRequirement } from "../controllers/requirement";
import { validateRequestBody } from "../middleware/validation";

export const requirementRouter = Router();

requirementRouter.post(
  "/requirement",
  validateRequestBody(requirementInitializer),
  handleAddRequirement,
);
