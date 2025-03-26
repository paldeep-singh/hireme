import { UserCredentials } from "../../types/userCredentials.js";

export interface LoginRequest {
	method: "post";
	path: "/api/admin/login";
	responseBody: undefined;
	body: UserCredentials;
}

export interface ValidateSessionRequest {
	method: "get";
	path: "/api/admin/session/validate";
	responseBody: null;
	body: null;
}
