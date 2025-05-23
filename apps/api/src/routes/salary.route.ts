import { applicationInitializer } from "@repo/api-types/generated/api/hire_me/Application";
import { Router } from "express";
import { handleAddSalary } from "../controllers/salary.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const salaryRouter = Router();

salaryRouter.post(
	"/salary",
	authoriseRequest,
	validateRequestBody(applicationInitializer),
	handleAddSalary,
);
