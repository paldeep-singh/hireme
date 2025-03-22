import Role, { roleInitializer } from "../db/hire_me/Role.js";
import { RolePreview } from "../../types/rolePreview.js";

export const AddRole = {
  method: "post",
  path: "/api/role",
  schema: roleInitializer,
} as const;
export const GetRolePreviews = {
  method: "get",
  path: "/api/roles/previews",
} as const;

export type AddRoleResponse = Role;
export type GetRolePreviewsResponse = RolePreview[];
