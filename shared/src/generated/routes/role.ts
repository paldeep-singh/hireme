import { roleInitializer } from "src/generated/db/hire_me/Role.js";

export const routes = {
  AddRole: {
    method: "post",
    path: "/api/role",
    schema: roleInitializer,
  },
  GetRolePreviews: {
    method: "get",
    path: "/api/roles/previews",
  },
};
