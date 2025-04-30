import { roleLocationInitializer } from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { Router } from "express";
import { handleAddRoleLocation } from "../controllers/role-location.controller";
import { authoriseRequest } from "../middleware/authorisation";
import { validateRequestBody } from "../middleware/validation";

export const roleLocationRouter = Router();

roleLocationRouter.post(
	"/role-location",
	authoriseRequest,
	validateRequestBody(roleLocationInitializer),
	handleAddRoleLocation,
);
