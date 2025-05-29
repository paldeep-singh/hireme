import RoleLocation, {
	RoleLocationInitializer,
} from "@repo/api-types/generated/api/hire_me/RoleLocation";

// This file is generated and should not be modified directly.
export interface AddRoleLocationRequest {
	method: "post";
	path: "/api/role-location";
	params: null;
	responseBody: RoleLocation;
	body: RoleLocationInitializer;
}
