import {
	salaryInputSchema,
	salaryUpdateInputSchema,
} from "@repo/api-types/validators/Salary";
import { Router } from "express";
import { z } from "zod";
import {
	handleAddSalary,
	handleUpdateSalary,
} from "../controllers/salary.controller";
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

salaryRouter.patch(
	"/salary/:salary_id",
	authoriseRequest,
	validateRequestParams(
		z.object({
			salary_id: z.coerce.number().positive(),
		}),
	),
	validateRequestBody(salaryUpdateInputSchema),
	handleUpdateSalary,
);
