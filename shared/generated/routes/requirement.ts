import Requirement, {
	requirementInitializer,
} from "../db/hire_me/Requirement.js";

export const AddRequirement = {
	method: "post",
	path: "/api/requirement",
	schema: requirementInitializer,
} as const;

export type AddRequirementResponse = Requirement;
