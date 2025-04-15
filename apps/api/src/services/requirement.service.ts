import Requirement from "@repo/api-types/generated/api/hire_me/Requirement";
import { NewRequirement } from "../db/generated/hire_me/Requirement";
import { requirementModel } from "../models/requirement.model";

async function addRequirement(
	requirement: NewRequirement,
): Promise<Requirement> {
	try {
		const newRequirement = await requirementModel.addRequirement(requirement);

		if (!newRequirement) {
			throw new Error("no data");
		}

		return newRequirement;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const requirementService = {
	addRequirement,
};
