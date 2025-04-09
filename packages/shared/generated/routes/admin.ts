import { UserCredentials } from "../../types/api/UserCredentials.js";

// This file is generated and should not be modified directly.
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

export interface LogoutRequest {
	method: "delete";
	path: "/api/admin/logout";
	responseBody: null;
	body: null;
}
