import { faker } from "@faker-js/faker/.";
import { seedCompanies, seedRole } from "../../testUtils/dbHelpers";
import { requirementModel } from "../requirement";
import { getRandomMatchLevel } from "../../testUtils";
import db from "../db";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("addRequirement", () => {
  it("adds a new requirement to the database", async () => {
    const company = (await seedCompanies(1))[0];
    const role = await seedRole({ companyId: company.id, hasAdUrl: true });
    const description = faker.lorem.sentence();
    const match_level = getRandomMatchLevel();
    const match_justification = faker.lorem.sentence();
    const bonus = faker.datatype.boolean();

    const requirement = await requirementModel.addRequirement({
      role_id: role.id,
      bonus,
      description,
      match_justification,
      match_level,
    });

    expect(requirement.bonus).toEqual(bonus);
    expect(requirement.role_id).toEqual(role.id);
    expect(requirement.description).toEqual(description);
    expect(requirement.match_level).toEqual(match_level);
    expect(requirement.match_justification).toEqual(match_justification);
  });
});
