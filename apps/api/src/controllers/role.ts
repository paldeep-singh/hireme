import Role, { RoleInitializer } from "@repo/shared/generated/db/hire_me/Role";
import { RolePreviewJson } from "@repo/shared/types/rolePreview";
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

export const handleGetRolePreviews: RequestHandler<RolePreviewJson[]> = async (
	_,
	res,
) => {
	try {
		const rolePreviews = await roleModel.getRolePreviews();

		res.status(StatusCodes.OK).json(
			rolePreviews.map((rp) => ({
				...rp,
				date_added: rp.date_added.toISOString(),
				date_submitted: rp.date_submitted?.toISOString() ?? null,
			})),
		);
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
