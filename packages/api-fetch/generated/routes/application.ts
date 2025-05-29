import Application, {
	ApplicationInitializer,
} from "@repo/api-types/generated/api/hire_me/Application";

// This file is generated and should not be modified directly.
export interface AddApplicationRequest {
	method: "post";
	path: "/api/application";
	params: null;
	responseBody: Application;
	body: ApplicationInitializer;
}
