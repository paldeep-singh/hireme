import Requirement, {
	RequirementInitializer,
} from "@repo/api-types/generated/api/hire_me/Requirement";
import { NewRequirement } from "../db/generated/hire_me/Requirement";
import { requirementModel } from "../models/requirement.model";

async function addRequirement(
	requirement: NewRequirement,
): Promise<Requirement> {
	const newRequirement = await requirementModel.addRequirement(requirement);

	return newRequirement;
}

async function addRequirements(
	requirements: RequirementInitializer[],
): Promise<Requirement[]> {
	const newRequirements = await requirementModel.addRequirements(requirements);

	return newRequirements;
}

export const requirementService = {
	addRequirement,
	addRequirements,
};
