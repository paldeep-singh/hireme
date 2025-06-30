import { roleLocationInputSchema } from "@repo/api-types/validators/RoleLocation";
import { Router } from "express";
import { z } from "zod";
import {
	handleAddRoleLocation,
	handleUpdateRoleLocation,
} from "../controllers/role-location.controller";
import { authoriseRequest } from "../middleware/authorisation";
import {
	validateRequestBody,
	validateRequestParams,
} from "../middleware/validation";
import { roleIdParamSchema } from "./shared/schemas";

export const roleLocationRouter = Router();

roleLocationRouter.post(
	"/role/:role_id/location",
	authoriseRequest,
	validateRequestParams(roleIdParamSchema),
	validateRequestBody(roleLocationInputSchema),
	handleAddRoleLocation,
);

roleLocationRouter.post(
	"/role-location/:location_id",
	authoriseRequest,
	validateRequestParams(
		z.object({
			location_id: z.coerce.number().positive(),
		}),
	),
	validateRequestBody(roleLocationInputSchema),
	handleUpdateRoleLocation,
);
