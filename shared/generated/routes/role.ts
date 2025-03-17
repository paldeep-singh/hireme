import { roleInitializer } from "../db/hire_me/Role.js";

export const AddRole = {
  method: "post",
  path: "/api/role",
  schema: roleInitializer,
} as const;
export const GetRolePreviews = {
  method: "get",
  path: "/api/roles/previews",
} as const;
