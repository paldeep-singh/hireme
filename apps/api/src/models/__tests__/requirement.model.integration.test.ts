import { generateRequirementData } from "@repo/shared/testHelpers/generators";
import { seedCompanies, seedRole } from "../../testUtils/dbHelpers";
import db from "../db";
import { requirementModel } from "../requirement";

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
