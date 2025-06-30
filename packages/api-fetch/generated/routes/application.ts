import Application from "@repo/api-types/generated/api/hire_me/Application";
import { ApplicationInput } from "@repo/api-types/validators/Application";

// This file is generated and should not be modified directly.
export interface AddApplicationRequest {
	method: "post";
	path: "/api/role/:roleId/application";
	params: null;
	responseBody: Application;
	body: ApplicationInput;
}
