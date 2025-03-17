import { Router } from "express";

import {
  handleAddCompany,
  handleGetCompanies,
} from "../controllers/company.js";
import { validateRequestBody } from "../middleware/validation.js";
import { companyInitializer } from "shared/generated/db/hire_me/Company.js";

export const companyRouter = Router();

companyRouter.post(
  "/company",
  validateRequestBody(companyInitializer),
  handleAddCompany,
);

companyRouter.get("/companies", handleGetCompanies);
