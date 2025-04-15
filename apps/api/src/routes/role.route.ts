import { roleInitializer } from "@repo/api-types/generated/api/hire_me/Role";
import { Router } from "express";
import {
	handleAddRole,
	handleGetRolePreviews,
} from "../controllers/role.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const roleRouter = Router();

roleRouter.post(
	"/role",
	authoriseRequest,
	validateRequestBody(roleInitializer),
	handleAddRole,
);

roleRouter.get("/roles/previews", authoriseRequest, handleGetRolePreviews);
