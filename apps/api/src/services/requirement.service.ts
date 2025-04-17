import Requirement from "@repo/api-types/generated/api/hire_me/Requirement";
import { NewRequirement } from "../db/generated/hire_me/Requirement";
import { requirementModel } from "../models/requirement.model";

async function addRequirement(
	requirement: NewRequirement,
): Promise<Requirement> {
	const newRequirement = await requirementModel.addRequirement(requirement);

	return newRequirement;
}

export const requirementService = {
	addRequirement,
};
