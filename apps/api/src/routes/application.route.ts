import { applicationInitializer } from "@repo/api-types/generated/api/hire_me/Application";
import { Router } from "express";
import { handleAddApplication } from "../controllers/application.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const applicationRouter = Router();

applicationRouter.post(
	"/application",
	authoriseRequest,
	validateRequestBody(applicationInitializer),
	handleAddApplication,
);
