import Role from "@repo/api-types/generated/api/hire_me/Role";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { RoleInput } from "@repo/api-types/validators/Role";

// This file is generated and should not be modified directly.
export interface AddRoleRequest {
	method: "post";
	path: "/api/company/:company_id/role";
	params: { company_id: number };
	responseBody: Role;
	body: RoleInput;
}

export interface GetRolePreviewsRequest {
	method: "get";
	path: "/api/roles/previews";
	params: null;
	responseBody: RolePreview[];
	body: null;
}

export interface GetRoleDetailsRequest {
	method: "get";
	path: "/api/role/:id";
	params: { id: number };
	responseBody: RoleDetails;
	body: null;
}
