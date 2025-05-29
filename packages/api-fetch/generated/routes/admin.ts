import { UserCredentials } from "@repo/api-types/types/api/UserCredentials";

// This file is generated and should not be modified directly.
export interface LoginRequest {
	method: "post";
	path: "/api/admin/login";
	params: null;
	responseBody: undefined;
	body: UserCredentials;
}

export interface ValidateSessionRequest {
	method: "get";
	path: "/api/admin/session/validate";
	params: null;
	responseBody: null;
	body: null;
}

export interface LogoutRequest {
	method: "delete";
	path: "/api/admin/logout";
	params: null;
	responseBody: null;
	body: null;
}
