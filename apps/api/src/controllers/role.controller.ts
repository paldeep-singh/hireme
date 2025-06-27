import Role, {
	RoleInitializer,
} from "@repo/api-types/generated/api/hire_me/Role";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { StatusCodes } from "http-status-codes";
import { RoleId } from "../db/generated/hire_me/Role";
import { roleService } from "../services/role.service";
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
	{ id: number }
> = async (req, res) => {
	const { id: roleId } = req.parsedParams;

	const roleDetails = await roleService.getRoleDetails(roleId as RoleId);

	res.status(StatusCodes.OK).json(roleDetails);
};
