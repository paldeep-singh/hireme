import { companyInitializer } from "@repo/api-types/generated/api/hire_me/Company";
import { Router } from "express";
import { handleAddCompany, handleGetCompanies } from "../controllers/company";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const companyRouter = Router();

companyRouter.post(
	"/company",
	authoriseRequest,
	validateRequestBody(companyInitializer),
	handleAddCompany,
);

companyRouter.get("/companies", authoriseRequest, handleGetCompanies);
