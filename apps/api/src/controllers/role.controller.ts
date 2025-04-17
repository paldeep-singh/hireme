import Role, {
	RoleInitializer,
} from "@repo/api-types/generated/api/hire_me/Role";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { StatusCodes } from "http-status-codes";
import { roleService } from "../services/role.service";
import { RequestHandler } from "./sharedTypes";

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
