import Role, { RoleInitializer } from "@repo/shared/generated/api/hire_me/Role";
import { RolePreview } from "@repo/shared/types/api/RolePreview";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { roleModel } from "../models/role";
import { RequestHandler } from "./sharedTypes";

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
