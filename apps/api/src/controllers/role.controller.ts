import Role, {
	RoleInitializer,
} from "@repo/api-types/generated/api/hire_me/Role";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { StatusCodes } from "http-status-codes";
import { RoleId } from "../db/generated/hire_me/Role";
import { roleService } from "../services/role.service";
import { AppError } from "../utils/errors";
import { RequestHandler } from "./sharedTypes";

export const roleErrorMessages = {
	INVALID_ROLE_ID: "Invalid role id.",
} as const;

export const handleAddRole: RequestHandler<Role, RoleInitializer> = async (
	req,
	res,
) => {
	const role = await roleService.addRole(req.body);
	res.status(StatusCodes.CREATED).json(role);
};

export const handleGetRolePreviews: RequestHandler<RolePreview[]> = async (
	_,
	res,
) => {
	const rolePreviews = await roleService.getRolePreviews();

	res.status(StatusCodes.OK).json(rolePreviews);
};

export const handleGetRoleDetails: RequestHandler<
	RoleDetails,
	undefined,
	{ id: string }
> = async (req, res) => {
	const rawId = req.params.id;
	const roleId = Number(rawId);

	if (isNaN(roleId)) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			true,
			roleErrorMessages.INVALID_ROLE_ID,
		);
	}

	const roleDetails = await roleService.getRoleDetails(roleId as RoleId);

	res.status(StatusCodes.OK).json(roleDetails);
};
