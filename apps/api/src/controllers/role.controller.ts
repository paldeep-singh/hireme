import Role from "@repo/api-types/generated/api/hire_me/Role";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { RoleInput } from "@repo/api-types/validators/Role";
import { StatusCodes } from "http-status-codes";
import { CompanyId } from "../db/generated/hire_me/Company";
import { RoleId } from "../db/generated/hire_me/Role";
import { roleService } from "../services/role.service";
import { RequestHandler } from "./sharedTypes";

export const roleErrorMessages = {
	INVALID_ROLE_ID: "Invalid role id.",
} as const;

export const handleAddRole: RequestHandler<
	Role,
	RoleInput,
	{ company_id: number }
> = async (req, res) => {
	const role = await roleService.addRole({
		...req.body,
		company_id: req.parsedParams.company_id as CompanyId,
	});
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
