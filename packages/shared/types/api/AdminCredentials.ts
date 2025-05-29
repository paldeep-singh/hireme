import Admin from "../../generated/api/hire_me/Admin.js";

export interface AdminCredentials {
	email: Admin["email"];
	password: string;
}
