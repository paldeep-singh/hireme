import { RolePreview } from "../../types/rolePreview";
import Role, { RoleInitializer } from "../db/hire_me/Role";

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
