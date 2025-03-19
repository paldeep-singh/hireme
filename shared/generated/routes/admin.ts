import { userCredentials } from "../../types/userCredentials.js";

export const Login = {
  method: "post",
  path: "/api/admin/login",
  schema: userCredentials,
} as const;
