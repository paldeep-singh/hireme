import Requirement from "@repo/api-types/generated/api/hire_me/Requirement";
import { RequirementInput } from "@repo/api-types/validators/Requirement";

// This file is generated and should not be modified directly.
export interface AddRequirementRequest {
	method: "post";
	path: "/api/role/:role_id/requirement";
	params: { role_id: number };
	responseBody: Requirement;
	body: RequirementInput;
}

export interface AddRequirementsRequest {
	method: "post";
	path: "/api/role/:role_id/requirements";
	params: { role_id: number };
	responseBody: Requirement[];
	body: RequirementInput[];
}
