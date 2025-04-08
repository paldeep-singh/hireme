import DBRequirement, {
	DBRequirementInitializer,
} from "../db/hire_me/Requirement.js";

// This file is generated and should not be modified directly.
export interface AddRequirementRequest {
	method: "post";
	path: "/api/requirement";
	responseBody: DBRequirement;
	body: DBRequirementInitializer;
}
