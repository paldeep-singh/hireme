import Application, {
	ApplicationInitializer,
} from "../api/hire_me/Application.js";

// This file is generated and should not be modified directly.
export interface AddApplicationRequest {
	method: "post";
	path: "/api/application";
	params: null;
	responseBody: Application;
	body: ApplicationInitializer;
}
