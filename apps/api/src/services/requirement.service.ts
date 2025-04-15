import Requirement, {
	RequirementInitializer,
} from "@repo/api-types/generated/api/hire_me/Requirement";
import { db } from "../db/database";

async function addRequirement({
	role_id,
	bonus,
	description,
}: RequirementInitializer): Promise<Requirement> {
	try {
		const requirement = await db
			.withSchema("hire_me")
			.insertInto("requirement")
			.values({
				role_id,
				bonus,
				description,
			})
			.returning(["id", "role_id", "bonus", "description"])
			.executeTakeFirstOrThrow();

		return requirement;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const requirementModel = {
	addRequirement,
};
