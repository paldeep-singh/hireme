import RoleLocation, {
	RoleLocationInitializer,
} from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import { RoleLocationInput } from "@repo/api-types/validators/RoleLocation";
import { RoleLocationId } from "../db/generated/hire_me/RoleLocation";
import { roleLocationModel } from "../models/role-location.model";
import { toPostgresNumRange } from "../utils/postgresRange";

async function addRoleLocation(
	location: RoleLocationInitializer,
): Promise<RoleLocation> {
	const result = await roleLocationModel.addRoleLocation({
		...location,
		office_days: toPostgresNumRange(location.office_days, "office_days"),
	});

	return {
		...result,
		office_days: toNumrangeObject(result.office_days),
	};
}

async function updateRoleLocation(
	updates: RoleLocationInput,
	id: RoleLocationId,
): Promise<RoleLocation> {
	const updatedLocation = await roleLocationModel.updateRoleLocation(
		{
			...updates,
			office_days: toPostgresNumRange(updates.office_days, "office_days"),
		},
		id,
	);

	return {
		...updatedLocation,
		office_days: toNumrangeObject(updatedLocation.office_days),
	};
}

export const roleLocationService = {
	addRoleLocation,
	updateRoleLocation,
};
