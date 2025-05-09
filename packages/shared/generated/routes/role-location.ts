import RoleLocation, {
	RoleLocationInitializer,
} from "../api/hire_me/RoleLocation.js";

// This file is generated and should not be modified directly.
export interface AddRoleLocationRequest {
	method: "post";
	path: "/api/role-location";
	params: null;
	responseBody: RoleLocation;
	body: RoleLocationInitializer;
}
