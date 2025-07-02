import {
	roleInputSchema,
	roleUpdateInputSchema,
} from "@repo/api-types/validators/Role";
import { Router } from "express";
import { z } from "zod";
import {
	handleAddRole,
	handleDeleteRole,
	handleGetRoleDetails,
	handleGetRolePreviews,
	handleUpdateRole,
} from "../controllers/role.controller";
import { authoriseRequest } from "../middleware/authorisation";
import {
	validateRequestBody,
	validateRequestParams,
} from "../middleware/validation";
import { roleIdParamSchema } from "./shared/schemas";

export const roleRouter = Router();

roleRouter.post(
	"/company/:company_id/role",
	authoriseRequest,
	validateRequestParams(
		z.object({
			company_id: z.coerce.number().positive(),
		}),
	),
	validateRequestBody(roleInputSchema),
	handleAddRole,
);

roleRouter.patch(
	"/role/:role_id",
	authoriseRequest,
	validateRequestParams(
		z.object({
			role_id: z.coerce.number().positive(),
		}),
	),
	validateRequestBody(roleUpdateInputSchema),
	handleUpdateRole,
);

roleRouter.delete(
	"/role/:role_id",
	authoriseRequest,
	validateRequestParams(roleIdParamSchema),
	handleDeleteRole,
);

roleRouter.get("/roles/previews", authoriseRequest, handleGetRolePreviews);

roleRouter.get(
	"/role/:id",
	authoriseRequest,
	validateRequestParams(
		z.object({
			id: z.coerce.number(),
		}),
	),
	handleGetRoleDetails,
);
