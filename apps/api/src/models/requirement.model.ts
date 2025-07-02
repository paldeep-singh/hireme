import { db } from "../db/database";
import {
	NewRequirement,
	RequirementId,
	RequirementUpdate,
} from "../db/generated/hire_me/Requirement";

async function addRequirement(requirement: NewRequirement) {
	return await db
		.withSchema("hire_me")
		.insertInto("requirement")
		.values(requirement)
		.returningAll()
		.executeTakeFirstOrThrow();
}

async function addRequirements(requirements: NewRequirement[]) {
	return await db
		.withSchema("hire_me")
		.insertInto("requirement")
		.values(requirements)
		.returningAll()
		.execute();
}

async function updateRequirement(
	updates: RequirementUpdate,
	id: RequirementId,
) {
	return await db
		.withSchema("hire_me")
		.updateTable("requirement")
		.set(updates)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const requirementModel = {
	addRequirement,
	addRequirements,
	updateRequirement,
};
