import RoleLocation from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { RoleLocationInput } from "@repo/api-types/validators/RoleLocation";
import { StatusCodes } from "http-status-codes";
import { RoleId } from "../db/generated/hire_me/Role";
import { RoleLocationId } from "../db/generated/hire_me/RoleLocation";
import { roleLocationService } from "../services/role-location.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddRoleLocation: RequestHandler<
	RoleLocation,
	RoleLocationInput,
	{ role_id: number }
> = async (req, res) => {
	const roleLocation = await roleLocationService.addRoleLocation({
		...req.body,
		role_id: req.parsedParams.role_id as RoleId,
	});

	res.status(StatusCodes.CREATED).json(roleLocation);
};

export const handleUpdateRoleLocation: RequestHandler<
	RoleLocation,
	RoleLocationInput,
	{ location_id: number }
> = async (req, res) => {
	const updatedLocation = await roleLocationService.updateRoleLocation(
		req.body,
		req.parsedParams.location_id as RoleLocationId,
	);

	res.status(StatusCodes.OK).json(updatedLocation);
};
