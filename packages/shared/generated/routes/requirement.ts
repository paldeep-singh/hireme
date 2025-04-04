import Requirement, { RequirementInitializer } from "../db/hire_me/Requirement";

// This file is generated and should not be modified directly.
export interface AddRequirementRequest {
	method: "post";
	path: "/api/requirement";
	responseBody: Requirement;
	body: RequirementInitializer;
}
