import RoleLocation, {
	RoleLocationInitializer,
} from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { StatusCodes } from "http-status-codes";
import { roleLocationService } from "../services/role-location.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddRoleLocation: RequestHandler<
	RoleLocation,
	RoleLocationInitializer
> = async (req, res) => {
	const roleLocation = await roleLocationService.addRoleLocation(req.body);

	res.status(StatusCodes.CREATED).json(roleLocation);
};
