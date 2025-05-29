import { companyInitializerSchema } from "@repo/api-types/validators/Company";
import { Router } from "express";
import {
	handleAddCompany,
	handleGetCompanies,
} from "../controllers/company.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const companyRouter = Router();

companyRouter.post(
	"/company",
	authoriseRequest,
	validateRequestBody(companyInitializerSchema),
	handleAddCompany,
);

companyRouter.get("/companies", authoriseRequest, handleGetCompanies);
