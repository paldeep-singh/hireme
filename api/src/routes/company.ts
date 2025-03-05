import { Router } from "express";

import {
  handleCreateCompany,
  handleGetAllCompanies,
} from "../controllers/company";
import { validateRequestBody } from "../middleware/validation";
import { companyInitializer } from "../../generatedTypes/hire_me/Company";

export const companyRouter = Router();

companyRouter.post(
  "/company",
  validateRequestBody(companyInitializer),
  handleCreateCompany
);

companyRouter.get("/company", handleGetAllCompanies);
