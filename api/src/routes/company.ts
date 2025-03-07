import { Router } from "express";

import { handleAddCompany, handleGetCompanies } from "../controllers/company";
import { validateRequestBody } from "../middleware/validation";
import { companyInitializer } from "../../generatedTypes/hire_me/Company";

export const companyRouter = Router();

companyRouter.post(
  "/company",
  validateRequestBody(companyInitializer),
  handleAddCompany,
);

companyRouter.get("/companies", handleGetCompanies);
