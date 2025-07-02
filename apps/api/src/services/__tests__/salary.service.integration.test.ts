import { generateApiSalaryData } from "@repo/api-types/testUtils/generators";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import { db } from "../../db/database";
import { Role } from "../../db/generated/hire_me/Role";
import {
	clearRoleTable,
	seedCompanies,
	seedRole,
	seedSalary,
} from "../../testUtils/dbHelpers";
import { salaryService } from "../salary.service";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("salaryService", () => {
	let role: Role;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		role = await seedRole(company.id);
	});

	afterEach(async () => {
		await clearRoleTable();
	});

	describe("addSalary", () => {
		describe("when a permanent salary is provided", () => {
			it("adds a salary to the database", async () => {
				const salaryData = generateApiSalaryData(role.id);

				const { id, ...rest } = await salaryService.addSalary(salaryData);

				expect(id).toBeNumber();

				expect(rest).toEqual(salaryData);
			});
		});

		describe("when a fixed term salary with term is provided", () => {
			it("adds a salary to the database", async () => {
				const salaryData = generateApiSalaryData(role.id);

				const { id, ...rest } = await salaryService.addSalary(salaryData);

				expect(id).toBeNumber();

				expect(rest).toEqual(salaryData);
			});
		});
	});

	describe("updateSalary", () => {
		it("updates the salary in the database", async () => {
			const salary = await seedSalary(role.id);

			const { role_id: _, ...updates } = await generateApiSalaryData(role.id);

			const updatedSalary = await salaryService.updateSalary(
				updates,
				salary.id,
			);

			expect(updatedSalary).toEqual({
				...updates,
				role_id: salary.role_id,
				id: salary.id,
			});

			const fetchedSalary = await db
				.withSchema("hire_me")
				.selectFrom("salary")
				.where("id", "=", salary.id)
				.selectAll()
				.executeTakeFirstOrThrow();

			expect({
				...fetchedSalary,
				salary_range: toNumrangeObject(fetchedSalary.salary_range),
			}).toEqual({
				...updates,
				role_id: salary.role_id,
				id: salary.id,
			});
		});
	});
});
