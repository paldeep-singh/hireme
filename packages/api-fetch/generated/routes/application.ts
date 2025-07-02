import Application from "@repo/api-types/generated/api/hire_me/Application";
import { ApplicationInput , ApplicationUpdateInput } from "@repo/api-types/validators/Application";

// This file is generated and should not be modified directly.
export interface AddApplicationRequest {
	method: "post";
	path: "/api/role/:role_id/application";
	params: { role_id: number };
	responseBody: Application;
	body: ApplicationInput;
}

export interface UpdateApplicationRequest {
	method: "patch";
	path: "/api/application/:application_id";
	params: { application_id: number };
	responseBody: Application;
	body: ApplicationUpdateInput;
}
