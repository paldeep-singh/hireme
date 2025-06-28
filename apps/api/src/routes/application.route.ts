import { applicationInputSchema } from "@repo/api-types/validators/Application";
import { Router } from "express";
import { handleAddApplication } from "../controllers/application.controller";
import { authoriseRequest } from "../middleware/authorisation";
import {
	validateRequestBody,
	validateRequestParams,
} from "../middleware/validation";
import { roleIdParamSchema } from "./shared/schemas";

export const applicationRouter = Router();

applicationRouter.post(
	"/role/:roleId/application",
	authoriseRequest,
	validateRequestBody(applicationInputSchema),
	validateRequestParams(roleIdParamSchema),
	handleAddApplication,
);
