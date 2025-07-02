import RoleLocation from "@repo/api-types/generated/api/hire_me/RoleLocation";
import { RoleLocationInput , RoleLocationUpdateInput } from "@repo/api-types/validators/RoleLocation";

// This file is generated and should not be modified directly.
export interface AddRoleLocationRequest {
	method: "post";
	path: "/api/role/:role_id/location";
	params: { role_id: number };
	responseBody: RoleLocation;
	body: RoleLocationInput;
}

export interface UpdateRoleLocationRequest {
	method: "patch";
	path: "/api/role-location/:location_id";
	params: { location_id: number };
	responseBody: RoleLocation;
	body: RoleLocationUpdateInput;
}
