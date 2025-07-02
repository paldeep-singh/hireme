import {
	companyInitializerSchema,
	companyUpdateInputSchema,
} from "@repo/api-types/validators/Company";
import { Router } from "express";
import { z } from "zod";
import {
	handleAddCompany,
	handleGetCompanies,
	handleUpdateCompany,
} from "../controllers/company.controller";
import { authoriseRequest } from "../middleware/authorisation";
import {
	validateRequestBody,
	validateRequestParams,
} from "../middleware/validation";

export const companyRouter = Router();

companyRouter.post(
	"/company",
	authoriseRequest,
	validateRequestBody(companyInitializerSchema),
	handleAddCompany,
);

companyRouter.get("/companies", authoriseRequest, handleGetCompanies);

companyRouter.patch(
	"/company/:company_id",
	authoriseRequest,
	validateRequestParams(
		z.object({
			company_id: z.coerce.number(),
		}),
	),
	validateRequestBody(companyUpdateInputSchema),
	handleUpdateCompany,
);
