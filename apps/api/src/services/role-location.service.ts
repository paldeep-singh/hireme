import RoleLocation, {
	RoleLocationInitializer,
} from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import { Range } from "postgres-range";
import { roleLocationModel } from "../models/role-location.model";

async function addRoleLocation(
	location: RoleLocationInitializer,
): Promise<RoleLocation> {
	const result = await roleLocationModel.addRoleLocation({
		...location,
		office_days: location.office_days
			? new Range(location.office_days.min, location.office_days.max, 0)
			: null,
	});

	return {
		...result,
		office_days: toNumrangeObject(result.office_days),
	};
}

export const roleLocationService = {
	addRoleLocation,
};
