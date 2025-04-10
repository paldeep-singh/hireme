import Requirement, {
	RequirementInitializer,
} from "../api/hire_me/Requirement.js";

// This file is generated and should not be modified directly.
export interface AddRequirementRequest {
	method: "post";
	path: "/api/requirement";
	responseBody: Requirement;
	body: RequirementInitializer;
}
