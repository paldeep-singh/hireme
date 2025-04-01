import { companyInitializer } from "@repo/shared/generated/db/hire_me/Company.js";
import { Router } from "express";
import {
	handleAddCompany,
	handleGetCompanies,
} from "../controllers/company.js";
import { authoriseRequest } from "../middleware/authorisation.js";
import { validateRequestBody } from "../middleware/validation.js";

export const companyRouter = Router();

companyRouter.post(
	"/company",
	authoriseRequest,
	validateRequestBody(companyInitializer),
	handleAddCompany,
);

companyRouter.get("/companies", authoriseRequest, handleGetCompanies);
