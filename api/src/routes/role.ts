import { roleInitializer } from "@repo/shared/generated/db/Role";
import { Router } from "express";
import { handleAddRole, handleGetRolePreviews } from "../controllers/role";
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
