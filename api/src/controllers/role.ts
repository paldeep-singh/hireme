import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Role, { RoleInitializer } from "shared/generated/db/hire_me/Role.js";
import { RolePreview } from "shared/types/rolePreview.js";
import { roleModel } from "../models/role.js";
import { RequestHandler } from "./sharedTypes.js";

export const handleAddRole: RequestHandler<Role, RoleInitializer> = async (
	req,
	res,
) => {
	try {
		const role = await roleModel.addRole(req.body);
		res.status(StatusCodes.CREATED).json(role);
	} catch (error) {
		if (error instanceof Error) {
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ error: error.message });
			return;
		}

		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
	}
};

export const handleGetRolePreviews: RequestHandler<RolePreview[]> = async (
	_,
	res,
) => {
	try {
		const rolePreviews = await roleModel.getRolePreviews();

		res.status(StatusCodes.OK).json(rolePreviews);
	} catch (error) {
		if (error instanceof Error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: error.message,
			});
			return;
		}

		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: ReasonPhrases.INTERNAL_SERVER_ERROR,
		});
	}
};
