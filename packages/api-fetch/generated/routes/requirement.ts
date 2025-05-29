import Requirement, {
	RequirementInitializer,
} from "@repo/api-types/generated/api/hire_me/Requirement";

// This file is generated and should not be modified directly.
export interface AddRequirementRequest {
	method: "post";
	path: "/api/requirement";
	params: null;
	responseBody: Requirement;
	body: RequirementInitializer;
}
