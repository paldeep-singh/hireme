import Requirement, {
	RequirementInitializer,
} from "@repo/shared/generated/api/hire_me/Requirement";
import db from "../db/db";
import { addRequirement as addRequirementQuery } from "./queries/requirement/AddRequirement.queries";

async function addRequirement({
	role_id,
	bonus,
	description,
}: RequirementInitializer): Promise<Requirement> {
	try {
		const requirement = await db.one(addRequirementQuery, {
			role_id,
			bonus,
			description,
		});

		return requirement as Requirement;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const requirementModel = {
	addRequirement,
};
