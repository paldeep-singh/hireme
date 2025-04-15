import { db } from "../db/database";
import { NewRequirement } from "../db/generated/hire_me/Requirement";

async function addRequirement(requirement: NewRequirement) {
	return await db
		.withSchema("hire_me")
		.insertInto("requirement")
		.values(requirement)
		.returningAll()
		.executeTakeFirst();
}

export const requirementModel = {
	addRequirement,
};
