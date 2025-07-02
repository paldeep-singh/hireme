import { generateApiRequirementData } from "@repo/api-types/testUtils/generators";
import { db } from "../../db/database";
import {
	seedCompanies,
	seedRequirement,
	seedRole,
} from "../../testUtils/dbHelpers";
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

describe("addRequirements", () => {
	it("adds the new requirements to the database", async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);

		const requirementsDataList = Array.from({ length: 5 }).map(() =>
			generateRequirementData(role.id),
		);

		const returnedRequirements =
			await requirementService.addRequirements(requirementsDataList);

		returnedRequirements.forEach(({ id, ...rest }) => {
			expect(id).toBeNumber();

			expect(requirementsDataList).toIncludeAllMembers([rest]);
		});
	});
});

describe("updateRequirement", () => {
	it("updates the requirement in the database", async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);

		const requirement = await seedRequirement(role.id);

		const { role_id: _, ...updates } = generateApiRequirementData(role.id);

		const updatedRequirement = await requirementService.updateRequirement(
			updates,
			requirement.id,
		);

		expect(updatedRequirement).toEqual({
			...updates,
			id: requirement.id,
			role_id: role.id,
		});

		const fetchedRequirement = await db
			.withSchema("hire_me")
			.selectFrom("requirement")
			.where("id", "=", requirement.id)
			.selectAll()
			.executeTakeFirstOrThrow();

		expect(fetchedRequirement).toEqual({
			...updates,
			id: requirement.id,
			role_id: role.id,
		});
	});
});
