import { UserCredentials } from "../../types/userCredentials.js";
import { SessionId } from "../db/hire_me/Session.js";

export interface LoginRequest {
	method: "post";
	path: "/api/admin/login";
	responseBody: { id: SessionId };
	body: UserCredentials;
}

export interface ValidateSessionRequest {
	method: "get";
	path: "/api/admin/session/validate";
	responseBody: null;
	body: null;
}
