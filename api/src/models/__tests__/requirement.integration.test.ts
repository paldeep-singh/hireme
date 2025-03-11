import { seedCompanies, seedRole } from "../../testUtils/dbHelpers";
import { requirementModel } from "../requirement";
import { generateRequirementData } from "../../testUtils";
import db from "../db";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("addRequirement", () => {
  it("adds a new requirement to the database", async () => {
    const company = (await seedCompanies(1))[0];
    const role = await seedRole(company.id);

    const { bonus, description } = generateRequirementData(role.id);

    const requirement = await requirementModel.addRequirement({
      role_id: role.id,
      bonus,
      description,
    });

    expect(requirement.bonus).toEqual(bonus);
    expect(requirement.role_id).toEqual(role.id);
    expect(requirement.description).toEqual(description);
    expect(requirement.id).toBeNumber();
  });
});
