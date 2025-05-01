import { applicationInitializer } from "@repo/api-types/generated/api/hire_me/Application";
import { Router } from "express";
import { handleAddContract } from "../controllers/contract.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const contractRouter = Router();

contractRouter.post(
	"/contract",
	authoriseRequest,
	validateRequestBody(applicationInitializer),
	handleAddContract,
);
