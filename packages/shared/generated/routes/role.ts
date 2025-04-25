import { RoleDetails } from "../../types/api/RoleDetails.js";
import { RolePreview } from "../../types/api/RolePreview.js";
import Role, { RoleInitializer } from "../api/hire_me/Role.js";

// This file is generated and should not be modified directly.
export interface AddRoleRequest {
	method: "post";
	path: "/api/role";
	params: null;
	responseBody: Role;
	body: RoleInitializer;
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
