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

    const requirementData = generateRequirementData(role.id);

    const { id, ...rest } =
      await requirementModel.addRequirement(requirementData);

    expect(id).toBeNumber();
    expect(rest).toEqual(requirementData);
  });
});
