import { faker } from "@faker-js/faker/.";
import { seedCompanies, seedRole } from "../../testUtils";
import db from "../db";
import { requirementModel } from "../requirement";
import RequirementMatchLevel from "../../../generatedTypes/hire_me/RequirementMatchLevel";

afterAll(() => {
  db.$pool.end();
});

describe("addRequirement", () => {
  it("adds a new requirement to the database", async () => {
    const company = (await seedCompanies(1))[0];
    const role = await seedRole({ companyId: company.id, hasAdUrl: true });
    const description = faker.lorem.sentence();
    const match_level = faker.helpers.arrayElement<RequirementMatchLevel>([
      "exceeded",
      "met",
      "room_for_growth",
    ]);
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
