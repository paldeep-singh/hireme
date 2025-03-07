import Requirement, {
  RequirementInitializer,
} from "../../generatedTypes/hire_me/Requirement";
import db from "./db";

async function addRequirement({
  role_id,
  bonus,
  match_justification,
  match_level,
  description,
}: RequirementInitializer): Promise<Requirement> {
  try {
    const requirement = await db.one<Requirement>(
      `INSERT INTO requirement (role_id, bonus, match_justification, match_level, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, role_id, bonus, match_justification, match_level, description`,
      [role_id, bonus, match_justification, match_level, description],
    );

    return requirement;
  } catch (error) {
    throw new Error(`Database query failed: ${error}`);
  }
}

export const requirementModel = {
  addRequirement,
};
