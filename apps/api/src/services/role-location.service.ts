import RoleLocation, {
	RoleLocationInitializer,
} from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
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

export const roleLocationService = {
	addRoleLocation,
};
