import Requirement, {
	RequirementInitializer,
} from "../db/hire_me/Requirement.js";

export interface AddRequirementRequest {
	method: "post";
	path: "/api/requirement";
	responseBody: Requirement;
	body: RequirementInitializer;
}
