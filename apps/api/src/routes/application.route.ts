import { applicationInputSchema } from "@repo/api-types/validators/Application";
import { Router } from "express";
import { z } from "zod";
import {
	handleAddApplication,
	handleUpdateApplication,
} from "../controllers/application.controller";
import { authoriseRequest } from "../middleware/authorisation";
import {
	validateRequestBody,
	validateRequestParams,
} from "../middleware/validation";
import { roleIdParamSchema } from "./shared/schemas";

export const applicationRouter = Router();

applicationRouter.post(
	"/role/:role_id/application",
	authoriseRequest,
	validateRequestParams(roleIdParamSchema),
	validateRequestBody(applicationInputSchema),
	handleAddApplication,
);

applicationRouter.post(
	"/role/:role_id/application/:application_id",
	authoriseRequest,
	validateRequestParams(
		z.object({
			role_id: z.coerce.number(),
			application_id: z.coerce.number(),
		}),
	),
	validateRequestBody(applicationInputSchema),
	handleUpdateApplication,
);
