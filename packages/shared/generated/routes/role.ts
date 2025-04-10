import { RolePreview } from "../../types/api/RolePreview.js";
import Role, { RoleInitializer } from "../api/hire_me/Role.js";

// This file is generated and should not be modified directly.
export interface AddRoleRequest {
	method: "post";
	path: "/api/role";
	responseBody: Role;
	body: RoleInitializer;
}

export interface GetRolePreviewsRequest {
	method: "get";
	path: "/api/roles/previews";
	responseBody: RolePreview[];
	body: null;
}
