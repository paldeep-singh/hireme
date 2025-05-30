import { db } from "../db/database";
import { NewRequirement } from "../db/generated/hire_me/Requirement";

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

export const requirementModel = {
	addRequirement,
	addRequirements,
};
