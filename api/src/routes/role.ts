import { Router } from "express";
import { roleInitializer } from "shared/generated/db/hire_me/Role.js";
import { handleAddRole, handleGetRolePreviews } from "../controllers/role.js";
import { authoriseRequest } from "../middleware/authorisation.js";
import { validateRequestBody } from "../middleware/validation.js";

export const roleRouter = Router();

roleRouter.post(
	"/role",
	authoriseRequest,
	validateRequestBody(roleInitializer),
	handleAddRole,
);

roleRouter.get("/roles/previews", authoriseRequest, handleGetRolePreviews);
