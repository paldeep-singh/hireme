import { roleInitializer } from "../db/hire_me/Role";

export const routes = {
  AddRole: {
    method: "post",
    path: "/api/role",
    schema: roleInitializer,
  },
  GetRolePreviews: {
    method: "get",
    path: "/api/roles/previews",
    schema: undefined,
  },
};
