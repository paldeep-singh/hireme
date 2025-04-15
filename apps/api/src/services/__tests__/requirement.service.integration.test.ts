import { db } from "../../db/database";
import { seedCompanies, seedRole } from "../../testUtils/dbHelpers";
import { generateRequirementData } from "../../testUtils/generators";
import { requirementService } from "../requirement.service";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("addRequirement", () => {
	it("adds a new requirement to the database", async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);

		const requirementData = generateRequirementData(role.id);

		const { id, ...rest } =
			await requirementService.addRequirement(requirementData);

		expect(id).toBeNumber();
		expect(rest).toEqual(requirementData);
	});
});
