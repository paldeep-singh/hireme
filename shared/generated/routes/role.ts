import { RolePreview } from "../../types/rolePreview.js";
import Role, { RoleInitializer } from "../db/hire_me/Role.js";

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
