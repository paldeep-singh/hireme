import Requirement, {
	RequirementInitializer,
} from "@repo/shared/generated/db/Requirement";
import db from "./db";

async function addRequirement({
	role_id,
	bonus,
	description,
}: RequirementInitializer): Promise<Requirement> {
	try {
		const requirement = await db.one<Requirement>(
			`INSERT INTO requirement (role_id, bonus, description)
            VALUES ($1, $2, $3)
            RETURNING id, role_id, bonus, description`,
			[role_id, bonus, description],
		);

		return requirement;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const requirementModel = {
	addRequirement,
};
