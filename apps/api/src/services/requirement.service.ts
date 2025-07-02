import Requirement, {
	RequirementInitializer,
} from "@repo/api-types/generated/api/hire_me/Requirement";
import { RequirementUpdateInput } from "../../../../packages/shared/validators/Requirement";
import {
	NewRequirement,
	RequirementId,
} from "../db/generated/hire_me/Requirement";
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

async function updateRequirement(
	updates: RequirementUpdateInput,
	id: RequirementId,
): Promise<Requirement> {
	const updatedRequirement = await requirementModel.updateRequirement(
		updates,
		id,
	);

	return updatedRequirement;
}

export const requirementService = {
	addRequirement,
	addRequirements,
	updateRequirement,
};
