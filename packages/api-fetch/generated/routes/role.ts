import Role from "@repo/api-types/generated/api/hire_me/Role";
import { RoleInput , RoleUpdateInputShape } from "@repo/api-types/validators/Role";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";

// This file is generated and should not be modified directly.
export interface AddRoleRequest {
	method: "post";
	path: "/api/company/:company_id/role";
	params: { company_id: number };
	responseBody: Role;
	body: RoleInput;
}

export interface UpdateRoleRequest {
	method: "patch";
	path: "/api/role/:role_id";
	params: { role_id: number };
	responseBody: Role;
	body: RoleUpdateInputShape;
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
