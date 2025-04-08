import { RolePreviewJson } from "../../types/rolePreview.js";
import DBRole, { DBRoleInitializer } from "../db/hire_me/Role.js";

// This file is generated and should not be modified directly.
export interface AddRoleRequest {
	method: "post";
	path: "/api/role";
	responseBody: DBRole;
	body: DBRoleInitializer;
}

export interface GetRolePreviewsRequest {
	method: "get";
	path: "/api/roles/previews";
	responseBody: RolePreviewJson[];
	body: null;
}
