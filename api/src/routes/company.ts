import { Router } from "express";

import {
  handleCreateCompany,
  handleGetCompanies,
} from "../controllers/company";
import { validateRequestBody } from "../middleware/validation";
import { companyInitializer } from "../../generatedTypes/hire_me/Company";

export const companyRouter = Router();

companyRouter.post(
  "/company",
  validateRequestBody(companyInitializer),
  handleCreateCompany,
);

companyRouter.get("/companies", handleGetCompanies);
