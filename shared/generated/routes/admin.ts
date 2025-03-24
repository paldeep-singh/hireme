import { userCredentials } from "../../types/userCredentials.js";
import { SessionId } from "../db/hire_me/Session.js";

export const Login = {
	method: "post",
	path: "/api/admin/login",
	schema: userCredentials,
} as const;
export const ValidateSession = {
	method: "get",
	path: "/api/admin/session/validate",
} as const;

export interface LoginResponse {
	id: SessionId;
}
