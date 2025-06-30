import { salaryInputSchema } from "@repo/api-types/validators/Salary";
import { Router } from "express";
import { handleAddSalary } from "../controllers/salary.controller";
import { authoriseRequest } from "../middleware/authorisation";
import {
	validateRequestBody,
	validateRequestParams,
} from "../middleware/validation";
import { roleIdParamSchema } from "./shared/schemas";

export const salaryRouter = Router();

salaryRouter.post(
	"/role/:role_id/salary",
	authoriseRequest,
	validateRequestParams(roleIdParamSchema),
	validateRequestBody(salaryInputSchema),
	handleAddSalary,
);
