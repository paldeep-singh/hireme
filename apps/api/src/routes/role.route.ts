import { roleInitializerSchema } from "@repo/api-types/validators/Role";
import { Router } from "express";
import {
	handleAddRole,
	handleGetRoleDetails,
	handleGetRolePreviews,
} from "../controllers/role.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const roleRouter = Router();

roleRouter.post(
	"/role",
	authoriseRequest,
	validateRequestBody(roleInitializerSchema),
	handleAddRole,
);

roleRouter.get("/roles/previews", authoriseRequest, handleGetRolePreviews);

roleRouter.get("/role/:id", authoriseRequest, handleGetRoleDetails);
