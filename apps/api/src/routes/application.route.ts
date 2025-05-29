import { applicationInitializerSchema } from "@repo/api-types/validators/Application";
import { Router } from "express";
import { handleAddApplication } from "../controllers/application.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const applicationRouter = Router();

applicationRouter.post(
	"/application",
	authoriseRequest,
	validateRequestBody(applicationInitializerSchema),
	handleAddApplication,
);
