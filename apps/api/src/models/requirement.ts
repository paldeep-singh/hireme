import Requirement from "@repo/shared/generated/api/hire_me/Requirement";
import DBRequirement, {
	DBRequirementInitializer,
} from "@repo/shared/generated/db/hire_me/Requirement";
import dbPromise from "./dbPromise";

async function addRequirement({
	role_id,
	bonus,
	description,
}: DBRequirementInitializer): Promise<Requirement> {
	try {
		const requirement = await dbPromise.one<DBRequirement>(
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
